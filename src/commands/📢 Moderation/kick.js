const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server!')
    .addUserOption(
        option => 
        option.setName("target")
        .setDescription("Select a target to kick.")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the kick")
        .setRequired(false))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const Target = options.getMember("target")
        const Reason = options.getString("reason")

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTimestamp(Date.now())

        if(Target.kickable) {
            client.modlogs({
                Member: Target,
                Action: "Kick",
                Color: 0xfff763,
                Reason: Reason
            }, interaction)

            if (Reason) {
                    Target.kick(Reason)
                    Response.setDescription(`<@${interaction.member.id}> kicked User <@${Target.id}>`)
                    Response.addFields([
                        {
                            name: "Reason:",
                            value: Reason,
                            inline: false
                        }
                    ])
            } else {
                Target.kick()
                Response.setDescription(`<@${interaction.member.id}> kicked User <@${Target.id}>`)
            }
        } else {
            Response.setDescription(`❌ Could not kick User <@${Target.id}> because of missing Permissions!`).setColor(client.errorColor)
        }

        await interaction.reply({embeds: [Response]})
    }
}