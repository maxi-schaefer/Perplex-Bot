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
            default: "https://cdn.discordapp.com/attachments/965674056080826368/1003622130921001040/background.png"
        }
    }
}))