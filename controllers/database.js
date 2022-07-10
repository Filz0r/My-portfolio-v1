const mongoose = require('mongoose')
const { logger } = require('./logs')

//Mongoose connection
mongoose.connect(process.env.MONGODB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

const db = mongoose.connection
    .once("open", async (err) => {
      logger.info({
        message: "mongoDB connected successfully!",
      });
      if (err) return logger.error(err);
    })
    .on("error", (err) => {
      logger.error(`there was an error: ${err}`);
    });

module.exports = { db }