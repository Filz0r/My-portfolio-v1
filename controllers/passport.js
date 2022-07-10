const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/adminSchema");
const bcrypt = require("bcrypt");

function initialize(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }).then(async (user) => {
        if (!user) {
          console.log("someone tried to login at " + Date().toLocaleString());
          return done(null, false, { message: "No user with that email" });
        }
        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            console.log("someone tried to login with your email at: " + Date().toLocaleString());
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (e) {
          return done(e);
        }
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
