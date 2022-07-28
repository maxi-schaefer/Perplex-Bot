const { Client, Message } = require('discord.js')

const featuresDB = require('../../models/Features') 
const levelDB = require('../../models/LevelSystem')

module.exports = {
    name: "messageCreate",
    rest: false,
    once: false,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        const { guild, member } = message
        if(member.user.bot) return;

        let Enabled = false
        const result = await featuresDB.findOne({GuildID: guild.id})
        const { LevelSystem } = result

        if(LevelSystem) {
            addXP(guild.id, member.id, 5, message)
        }
    }
}

const calculateXP = (level) => level * level * 100

const addXP = async(guildId, userId, xpToAdd, message) => {
    const result = await levelDB.findOneAndUpdate({
        GuildID: guildId,
        UserID: userId
    }, {
        GuildID: guildId,
        UserID: userId,
        $inc: {
            xp: xpToAdd
        }
    }, {
        upsert: true,
        new: true
    })

    let { xp, level } = result
    const needed = calculateXP(level)

    if(xp >= needed) {
        level++
        xp -= needed

        message.reply(`<@${message.member.user.id}> reached Level ${level} 🥳`)

        await levelDB.updateOne({
            GuildID: guildId,
            UserID: userId,
        }, {
            level: level,
            xp: xp,
        })
    }
}

module.exports = { calculateXP }