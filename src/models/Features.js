const { model, Schema } = require('mongoose')

module.exports = model("Features", new Schema({
    GuildID: String,
    LevelSystem: {
        type: Boolean,
        default: false
    }
}))