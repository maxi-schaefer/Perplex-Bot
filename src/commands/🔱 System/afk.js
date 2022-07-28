const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const DB = require("../../models/AFKSystem")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set yourself away from keyboard!")
    .addSubcommand(
        command => 
        command.setName("set")
        .setDescription("Set your AFK status!")
        .addStringOption(
            option => 
            option.setName("status")
            .setDescription("Set your status message!")
            .setRequired(true)
        )
    )
    .addSubcommand(
        command => 
        command.setName("return")
        .setDescription("Return from being afk!")),
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { guild, user, createdTimestamp, options } = interaction;

        const Response = new EmbedBuilder()
        .setTitle("💤 AFK System")
        .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})

        const afkStatus = options.getString("status")

        try {
            
            switch (options.getSubcommand()) {
                case "set": {
                    await DB.findOneAndUpdate(
                        {GuildID: guild.id, UserID: user.id},
                        {Status: afkStatus, Time: parseInt(createdTimestamp / 1000)},
                        {new: true, upsert: true}
                    )

                    Response.setColor(client.mainColor).setDescription(`✅ Your AFK status has been updated to ${afkStatus}.`);

                    return interaction.reply({embeds: [Response], ephemeral: true})
                }
                break;

                case "return": {
                    await DB.deleteOne({ GuildID: guild.id, UserID: user.id });

                    Response.setColor(client.mainColor).setDescription(`❌ Your AFK status has been removed.`);

                    return interaction.reply({embeds: [Response], ephemeral: true})
                }
                break;
            }

        } catch (err) {
            return console.error(err)
        }
    }
}