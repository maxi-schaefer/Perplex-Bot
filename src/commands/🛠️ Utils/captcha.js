const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js')
const DB = require("../../models/CaptchaSystem")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Setup or send Captcha!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
        command => 
        command.setName("message")
        .setDescription("Send the captcha message!")
        .addChannelOption(
            option =>
            option.setName("channel")
            .setDescription("Channel for the message for example a verify channel!")
            .setRequired(true)
        )),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const channel = options.getChannel("channel")
        const sub = options.getSubcommand()

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTitle("🤖 Captcha")

        switch(sub) {
            
            case "message": {
                Response.setDescription("Please solve the captcha that I sent you within 30 seconds or you are gonna get kicked from this server!")
                interaction.reply({content: "Successfully sent message!", ephemeral: true})
                return channel.send({embeds: [Response], ephemeral: true});
            }

        }
    }
}