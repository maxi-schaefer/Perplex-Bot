const { model, Schema } = require('mongoose')

module.exports = model("modlogs", new Schema({
    GuildID: String,
    ChannelID: String
}))