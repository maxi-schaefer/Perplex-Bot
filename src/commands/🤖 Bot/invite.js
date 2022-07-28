const { EmbedBuilder } = require('@discordjs/builders')
const { Client, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite me to your own server!"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTitle("💌 Invite Me")
        .setFooter({text: client.user.tag, iconURL: client.user.displayAvatarURL()})
        .setDescription(`[Invite Me](${link})`)

        await interaction.reply({embeds: [Response]})

    }
}