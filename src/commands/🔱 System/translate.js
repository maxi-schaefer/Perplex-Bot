const { Client, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const translate = require("@iamtraction/google-translate")
const { EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate any text to a specific language!")
    .addStringOption(
        option => 
        option.setName("text")
        .setDescription("The text you wanna translate!")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("language")
        .setDescription("The language you wanna translate to!")
        .addChoices(
            { name: "English", value: "english"},
            { name: "German", value: "german"},
            { name: "French", value: "french"},
            { name: "Russian", value: "russian"},
        ).setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
        async execute(interaction, client) {

            const { options } = interaction
            const text = options.getString("text")
            const language = options.getString("language")

            switch (language) {
                case "english": {
                    const translated = await translate(text, { to: 'en' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "german": {
                    const translated = await translate(text, { to: 'de' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "french": {
                    const translated = await translate(text, { to: 'fr' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "spanish": {
                    const translated = await translate(text, { to: 'sp' })
                    send_translated(text, translated.text, interaction, client)
                }

                case "russian": {
                    const translated = await translate(text, { to: 'ru' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;
            }

    }
}

function send_translated(text, translated, interaction, client) {
    const Response = new EmbedBuilder()
    .setColor(client.mainColor)
    .setTitle("🌍 Translator")
    .addFields(
        { name: "Message:", value: text, inline: true},
        { name: "Translated:", value: translated, inline: true}
    ).setFooter({text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.user.displayAvatarURL()})

    interaction.channel.send({ embeds: [Response] })
    interaction.reply({content: "Successfully translated message!", ephemeral: true})
}