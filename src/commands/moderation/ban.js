const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server!')
    .addUserOption(
        option => 
        option.setName("target")
        .setDescription("Select a target to ban.")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reason for the ban")
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

        if(Target.bannable) {
            client.modlogs({
                Member: Target,
                Action: "Ban",
                Color: 0xf5425a,
                Reason: Reason
            }, interaction)

            if (Reason) {
                    await interaction.guild.bans.create(Target, {reason: Reason})
                    Response.setDescription(`<@${interaction.member.id}> banned User <@${Target.id}>`)
                    Response.addFields([
                        {
                            name: "Reason:",
                            value: Reason,
                            inline: false
                        }
                    ])
            } else {
                await interaction.guild.bans.create(Target)
                Response.setDescription(`<@${interaction.member.id}> banned User <@${Target.id}>`)
            }
        } else {
            Response.setDescription(`❌ Could not ban User <@${Target.id}> because of missing Permissions!`).setColor(client.errorColor)
        }

        await interaction.reply({embeds: [Response]})
    }
}