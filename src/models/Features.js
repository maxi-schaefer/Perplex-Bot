const { model, Schema } = require('mongoose')

module.exports = model("Features", new Schema({
    GuildID: String,
    LevelSystem: {
        Enabled: {
            type: Boolean,
            default: false,
        },
        Background: {
            type: String,
            default: "https://cdn.discordapp.com/attachments/984457148538945546/1003609214222094346/test.png"
        }
    }
}))