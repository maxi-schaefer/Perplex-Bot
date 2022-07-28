const { Message, EmbedBuilder, Embed } = require('discord.js')
const DB = require("../../models/AFKSystem")

module.exports = {
    name: "messageCreate",
    once: false,
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        //await DB.deleteOne({ GuildID: message.guild.id, UserID: message.author.id })

        if(message.mentions.members) {
            const Response = new EmbedBuilder()
            .setColor(0xff5454)
            
            message.mentions.members.forEach((m) => {
                DB.findOne({GuildID: message.guild.id, UserID: m.id}, async(err, data) => {
                    if(err) throw err;

                    if(data) 
                        Response.setDescription(`${m} went AFK <t:${data.Time}:R>\n **Status:** ${data.Status}`);
                        return message.reply({embeds: [Response]})
                })
            })
        }
    }
}