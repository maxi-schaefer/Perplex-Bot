const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("socials")
    .setDescription("View the Socials of my Creator!"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        
        const Response = new EmbedBuilder()
        .setTitle("♦️ Socials")
        .setDescription(
        `💻 │ [Github](https://github.com/gokiimax)\n📹 │ [Youtube](https://www.youtube.com/channel/UCjqJ3HJkiyu12fzFKIGEovQ)\n📱 │ [Instagram](https://www.instagram.com/maxii.x6)\n🐦 │ [Twitter](https://www.twitter.com/gokimax_x)`)
        .setTimestamp(Date.now())
        .setColor(client.mainColor)
        .setThumbnail('https://github.com/gokiimax.png')

        interaction.reply({embeds: [Response]})

    }
}