const { Client, VoiceState, ChannelType } = require("discord.js");
const DB = require("../../models/VoiceSystem")

module.exports = {
  name: "voiceStateUpdate",
  rest: false,
  once: false,
  /**
   * @param {Client} client
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  async execute(oldState, newState, client) {
    const { member, guild } = newState;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const joinToCreate = DB.findOne({ GuildID: guild.id }, async (err, data) => {
      if(!data) return;

        if(oldChannel !== newChannel && newChannel && newChannel.id === data.ChannelID) {
            const voiceChannel = await guild.channels.create({
                name: `🔰 │ ${member.user.tag}`,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: member.user.id, allow: ["Connect"]},
                    { id: guild.id, deny: ["Connect"]}
                ]
            })
    
            client.voiceGenerator.set(member.id, voiceChannel.id);
            await newChannel.permissionOverwrites.edit(member, {Connect: false});
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 30*1000);
    
            return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
        }
    
        const ownedChannel = client.voiceGenerator.get(member.id);
    
        if(ownedChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
          client.voiceGenerator.set(member.id, null);
          oldChannel.delete().catch(() => {});
        }
    });
  }
};