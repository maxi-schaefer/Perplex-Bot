const { Client, SlashCommandBooleanOption, SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } = require('discord.js')
const Canvacord = require('canvacord')
const { calculateXP } = require('../../events/message/levels')

const featuresDB = require('../../models/Features')
const levelsDB = require('../../models/LevelSystem')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("See your rank or the rank from other people! (The level System need to be enabled)")
    .addUserOption(
        option =>
        option.setName("member")
        .setDescription("Member you want to see the rank")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        const levelSystemCheck = await featuresDB.findOne({GuildID: guild.id})
        if(levelSystemCheck) {
            const { LevelSystem } = levelSystemCheck
            if(!LevelSystem.Enabled) return interaction.reply({content: `I'm sorry to say that to you, but <@${guild.ownerId}> didn't enabled the Level System 🙁`, ephemeral: true})    

            const rankcard = new Canvacord.Rank()
            const user = options.getUser("member")
            const color = client.hexMainColor

            if (user) {
                let levelResult = await levelsDB.findOne({GuildID: guild.id, UserID: user.id});
                
                if(levelResult && levelResult.xp) {
                    rankcard.setAvatar(user.displayAvatarURL({extension: 'png'}))
                    .setCurrentXP(parseInt(`${levelResult.xp || "0"}`))
                    .setLevel(parseInt(`${levelResult.level || "1"}`))
                    .setProgressBar(color)
                    .setRequiredXP(calculateXP(levelResult.level))
                    .setOverlay("#000000", 1, false)
                    .setUsername(`${user.username}`)
                    .setDiscriminator(`${user.discriminator}`)
                    .setBackground('IMAGE', LevelSystem.Background || "https://cdn.discordapp.com/attachments/984457148538945546/1003609214222094346/test.png")
                    .renderEmojis(true)
                    .setLevelColor(color)
                } else {
                    return interaction.reply({content: `${user} does not have any XP 🙁`, ephemeral: true})
                }
            } else {
                let levelResult = await levelsDB.findOne({GuildID: guild.id, UserID: member.user.id});

                if(levelResult && levelResult.xp) {
                    rankcard.setAvatar(member.user.displayAvatarURL({extension: 'png'}))
                    .setCurrentXP(parseInt(`${levelResult.xp}`) || 0)
                    .setLevel(parseInt(`${levelResult.level}` || 1))
                    .setRequiredXP(calculateXP(levelResult.level))
                    .setProgressBar(color)
                    .setOverlay("#000000", 1, false)
                    .setUsername(`${member.user.username}`)
                    .setDiscriminator(`${member.user.discriminator}`)
                    .setBackground('IMAGE', LevelSystem.Background || "https://cdn.discordapp.com/attachments/984457148538945546/1003609214222094346/test.png")
                    .renderEmojis(true)
                    .setLevelColor(color)
                } else {
                    return interaction.reply({content: `You do not have any XP 🙁`, ephemeral: true})
                }
            }

            const img = rankcard.build()
            const atta = new AttachmentBuilder(await img).setName("rank.png")
            interaction.reply({files: [atta]});
        } else {
            return interaction.reply({content: `I'm sorry to say that to you, but <@${guild.ownerId}> didn't enabled the Level System 🙁`, ephemeral: true})    
        }
    }
}
