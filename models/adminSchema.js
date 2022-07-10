const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const reqString = {
    type: String,
    required: true
}
const adminSchema = new mongoose.Schema({
    email: reqString,
    password: reqString,
})
adminSchema.plugin(passportLocalMongoose, {
    usernameField: this.email,
    usernameUnique: false
});
module.exports = mongoose.model('admin', adminSchema)