const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors, VoiceChannel, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Complete music system")
    .addSubcommand(
        command =>
        command.setName("play")
        .setDescription("Play a song")
        .addStringOption(
            option => 
            option.setName("query")
            .setDescription("Provide a name or a url for the song")
            .setRequired(true)
        )
    )
    .addSubcommand(
        command =>
        command.setName("volume")
        .setDescription("Alter the volume.")
        .addNumberOption(
            option =>
            option.setName("percent")
            .setDescription("10 = 10%")
            .setRequired(true)
        )
    )
    .addSubcommand(
        command =>
        command.setName("settings")
        .setDescription("Select an option")
        .addStringOption(
            option =>
            option.setName("options")
            .setDescription("Select an option")
            .setRequired(true)
            .addChoices(
                { name: "🗒️ Queue", value: "queue" },
                { name: "⏩ Skip", value: "skip" },
                { name: "⏸️ Pause", value: "pause" },
                { name: "▶️ Resume", value: "resume" },
                { name: "⏹️ Stop", value: "stop" },
                { name: "🔀 Shuffle", value: "shuffle" },
            )
        )
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTitle("🎶 Musik")

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ You must be in a voice channel to be able to use this command.")], ephemeral: true})
        const test = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(test && voiceChannel.id !== test.id) return interaction.reply({embeds: [Response.setDescription(`❌ I'm already playing in <#${test.id}>`)], ephemeral: true})

        try {
            
            switch(options.getSubcommand()) {
                case "play": {
                    client.distube.play( voiceChannel, options.getString("query"), {
                        textChannel: channel, member: member
                    })

                    return interaction.reply({content: `🎼 Request recieved`, ephemeral: true})
                }

                case "volume": {
                    const Volume = options.getNumber("percent")
                    if(Volume > 100 || Volume < 1) return interaction.reply({embeds: [Response.setDescription("You have to specify a number between 1 and 100")], ephemeral: true});

                    client.distube.setVolume(voiceChannel, Volume)
                    return interaction.reply({content: `🔊 Volume has been set to \`${Volume}%\``})
                }

                case "settings": {

                    const queue = await client.distube.getQueue(voiceChannel);
                    if(!queue) return interaction.reply({content: '🛑 There is now queue', ephemeral: true})

                    switch(options.getString("options")) {
                        case "skip": {
                            await queue.skip(voiceChannel)
                            return interaction.reply({content: '⏩ Song has been skipped.'})
                        }

                        case "shuffle": {
                            await queue.shuffle()
                            return interaction.reply({content: '🔀 Shuffled songs in the queue.'})
                        }

                        case "stop": {
                            await queue.stop(voiceChannel)
                            return interaction.reply({content: '⏹️ Music has been stopped.'})
                        }

                        case "pause": {
                            await queue.pause(voiceChannel)
                            return interaction.reply({content: '⏸️ Song has been paused.'})
                        }

                        case "resume": {
                            await queue.resume(voiceChannel)
                            return interaction.reply({content: '▶️ Song has been resumed.'})
                        }

                        case "queue": {
                            return interaction.reply({embeds: [
                                Response.setDescription(`${queue.songs.map(
                                    (song, id) => `\n**${id + 1}** | ${song.name} - \`${song.formattedDuration}\``)}`
                            )]});
                        }
                    }

                    return;
                }
            }

        } catch (error) {
            const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(`🛑 Alert: ${error}`)
            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
        }
    
    }
}