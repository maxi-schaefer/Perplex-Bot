const { EmbedBuilder } = require('@discordjs/builders');
const { DiscordTogether } = require('discord-together')
const { Client, SlashCommandBuilder, ChannelType, ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("together")
    .setDescription("Watch youtube videos together!")
    .addChannelOption(
        option => 
        option.setName("channel")
        .setDescription("Channel you want to acctivate this activity!")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("activity")
        .setDescription("The activity you want to perform!")
        .setRequired(true)
        .addChoices(
            { name: "📺 Youtube", value: "youtube" },
            { name: "☕ Word Snack", value: "wordsnack" },
            { name: "📝 Sketch Heads", value: "sketchheads" },
        )
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const discordTogether = new DiscordTogether(client);
        const { options } = interaction;
        const activity = options.getString("activity")
        const channel = options.getChannel("channel")
        
        const Response = new EmbedBuilder()
        .setFooter({text: client.user.tag, iconURL: client.user.displayAvatarURL()})

        switch(activity) {

            case "youtube": {
                Response.setTitle("📺 Youtube");
                discordTogether.createTogetherCode( channel.id, 'youtube' ).then(x => {
                    Response.setDescription(`[Click to watch youtube in ${channel}](${x.code})`)
                    return interaction.reply({embeds: [Response]})
                })
            }
            break;

            case "wordsnack": {
                Response.setTitle("☕ Word Snack");
                discordTogether.createTogetherCode( channel.id, 'wordsnack' ).then(x => {
                    Response.setDescription(`[Click to play wordsnack in ${channel}](${x.code})`)
                    return interaction.reply({embeds: [Response]})
                })
            }
            break;

            case "sketchheads": {
                Response.setTitle("✏️ Sketch Heads");
                discordTogether.createTogetherCode( channel.id, 'sketchheads' ).then(x => {
                    Response.setDescription(`[Click to play Sketch Heads in ${channel}](${x.code})`)
                    return interaction.reply({embeds: [Response]})
                })
            }
            break;
            
        }

    }
}