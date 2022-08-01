const { EmbedBuilder } = require('@discordjs/builders');
const { Client, Message } = require('discord.js')
const modlogsDB = require('../../models/ModerationLogs');

module.exports = {
    name: "messageUpdate",
    rest: false,
    once: false,
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage, client) {
        if(oldMessage.author.bot) return;
        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "")
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "")

        const Log = new EmbedBuilder()
        .setColor(client.mainColor)
        .setDescription(`📘 A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.\n
        **Original:**\n[ ${Original} ] \n**Edited:**\n [ ${Edited} ]`);

        const data = await modlogsDB.findOne({ GuildID: newMessage.guild.id })
        if(!data) return;

        const channel = newMessage.guild.channels.cache.get(data.ChannelID);
        channel.send({embeds: [Log]})
    }
}
