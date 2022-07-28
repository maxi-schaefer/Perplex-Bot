const { model, Schema } = require('mongoose')

module.exports = model("Captcha", new Schema({
    GuildID: String,
    Role: String
}))