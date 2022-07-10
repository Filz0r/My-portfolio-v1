require("dotenv").config();
const express = require("express");
const upload = require("express-fileupload");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const compression = require("compression");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const cors = require("cors");

require("./controllers/passport")(passport);
const { logger } = require("./controllers/logs");
const { db } = require("./controllers/database");

//app settings
const app = express();
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(upload());
app.use(cors());
app.use(compression());
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// log all requests to access.log
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "/logs/access.log"), {
      flags: "a",
    }),
  })
);

app.use(cookieParser(process.env.SECRET));
// passport
const sessionOptions = {
  store: new MongoStore({ mongooseConnection: db }),
  name: "FilipeDev",
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
};
app.use(session(sessionOptions));
//development
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionOptions.cookie.secure = true;
  sessionOptions.cookie.sameSite = true;
}
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


//global error variables
app.use(function (req, res, next) {
  res.locals.message = req.flash("message");
  next();
});

//routes
app.get('/', (req, res) => {
  res.status(200).redirect('/en/home')
})
app.use("/en", require("./routes/eng"));
app.use("/pt", require("./routes/pt"));
app.use("/admin", require("./routes/admin/admin"));

//logout
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/admin/login",
    { status: 200 },
    { user: req.user, title: "My Portfolio | FilipeDev" }
  );
});

//error handlers
app.get("/null", (req, res) => {
  res
    .status(400)
    .render("errors/400", { user: req.user, title: "Bad Request | FilipeDev" });
});

app.use((req, res) => {
  res
    .status(404)
    .render("errors/404", { user: req.user, title: "Not found | FilipeDev" });
});

//port and connection settings for diferent enviroments
app.listen(process.env.PORT, (err) => {
  if(err) {
    logger.error(err);
  } else {
    logger.info(`backend server listening on port ${process.env.PORT}`);
  }
});
