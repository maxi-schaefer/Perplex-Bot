const { model, Schema } = require('mongoose')

module.exports = model("VoiceSystem", new Schema({
    GuildID: String,
    ChannelID: String
}))