const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};
const skillSchema = new mongoose.Schema({
    category: reqString,
    name: reqString,
    path: reqString,
});

module.exports = mongoose.model("skills", skillSchema);
