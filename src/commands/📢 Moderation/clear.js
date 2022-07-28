const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, MessageContextMenuCommandInteraction, CommandInteractionOptionResolver } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear a amount of messages in the channel')
    .addNumberOption(
        option => 
        option.setName("amount")
        .setDescription("The amount of messages you wanna delete!")
        .setRequired(true)
        .setMaxValue(100)
        )
    .addUserOption(
        option => 
        option.setName("target")
        .setDescription("Select a target to clear their messages.")
        .setRequired(false))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount")
        const Target = options.getUser("target");

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)

        if (Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(async messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`)
                await interaction.reply({embeds: [Response]})
            })
        } else {
            await channel.bulkDelete(Amount, true).then(async messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel.`)
                await interaction.reply({embeds: [Response]})
            })
        }
    }
}