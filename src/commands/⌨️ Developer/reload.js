const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js')
const { loadCommands } = require('../../Handlers/CommandHandler')
const { loadEvents } = require('../../Handlers/EventHandler')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your events/command!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
        command => 
        command.setName("events")
        .setDescription("Reload your events!"))
    .addSubcommand(
        command => 
        command.setName("commands")
        .setDescription("Reload your commands!")),
    developer: true,
    /**
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();
        const Response = new EmbedBuilder()
        .setTitle("💻 Developer")
        .setColor(client.mainColor)

        switch (sub) {
            case "commands": {
                loadCommands(client);
                interaction.reply({embeds: [Response.setDescription("✅ Reloaded Commands!")]})
            }
            break;
        
            case "events": {
                loadEvents(client);
                interaction.reply({embeds: [Response.setDescription("✅ Reloaded Events!")]})
            }
            break;
        }

    },
}