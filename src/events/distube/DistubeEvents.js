const { EmbedBuilder } = require('@discordjs/builders')
const client = require('../../bot')

const Response = new EmbedBuilder()
.setColor(client.mainColor)
.setTitle("🎵 Music")
.setTimestamp(Date.now())

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [Response.setDescription(`▶️ | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`)]}
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send({embeds: [Response.setDescription(`✅ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)]})
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send({embeds: [Response.setDescription(`✅ | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`)]}
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send({embeds: [Response.setDescription('Voice channel is empty! Leaving the channel...')]}))
  .on('searchNoResult', (message, query) =>
    message.channel.send({embeds: [Response.setDescription(`❌ | No result found for \`${query}\`!`)]})
  )
  .on('finish', queue => queue.textChannel.send({embeds: [Response.setDescription("`✅ Finished!`")]}))