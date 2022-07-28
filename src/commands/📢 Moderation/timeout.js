const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timout a member from the server!')
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("The user to timout.")
        .setRequired(true))
    .addNumberOption(
        option =>
        option.setName("duration")
        .setDescription("The duration of the timout.")
        .setRequired(true)
        .addChoices(
            { name: "60 seconds", value: 60*1000 },
            { name: "5 minutes", value: 5*60*1000 },
            { name: "10 minutes", value: 10*60*1000 },
            { name: "30 minutes", value: 30*60*1000 },
            { name: "1 hour", value: 60*60*1000 },
            { name: "1 day", value: 24*60*60*1000 },
            { name: "1 week", value: 7*24*60*60*1000 }
        ))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the timeout")
        .setRequired(false))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction
        
        let member = options.getMember("user")
        let duration = options.getNumber("duration")
        let reason = options.getString("reason") || "No reason given"

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)

        if (!member) return interaction.reply({embeds: [Response.setDescription("❌ Invalid Member given").setColor(client.errorColor)], ephemeral: true})
        
        try {
            await member.timeout(duration, reason)
            Response.setDescription(`🚫 <@${member.user.id}> has been timed out!`)
            .addFields([
                {name: "Reason:", value: reason, inline: false},
            ])

            client.modlogs({
                Member: member,
                Action: "Timeout",
                Color: 0xfff763,
                Reason: reason
            }, interaction)
            return interaction.reply({embeds: [Response]})
        } catch (err) {
            return console.error(err)
        }
    
    }
} 