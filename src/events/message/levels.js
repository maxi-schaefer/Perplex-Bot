const { Client, Message, MessageType } = require('discord.js')

const featuresDB = require('../../models/Features') 
const levelDB = require('../../models/LevelSystem')

const calculateXP = (level) => level * level * 100

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
        if(!message.inGuild()) return;
        if(member.user.bot) return;

        const levelSystemCheck = await featuresDB.findOne({GuildID: guild.id})
        if(levelSystemCheck) {
            addXP(guild.id, member.id, 5, message) 
        }
    },
    calculateXP
}

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