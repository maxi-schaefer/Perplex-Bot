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
     * @param {*} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        const levelSystemCheck = await featuresDB.findOne({GuildID: guild.id})
        const { LevelSystem } = levelSystemCheck
        if(!LevelSystem) return interaction.reply({content: `I'm sorry to say that to you, but <@${guild.ownerId}> didn't enabled the Level System 🙁`, ephemeral: true})

        const rankcard = new Canvacord.Rank()
        const user = options.getUser("member")

        if (user) {
            let levelResult = await levelsDB.findOne({GuildID: guild.id, UserID: user.id});

            rankcard.setAvatar(user.displayAvatarURL({extension: 'png'}))
            .setCurrentXP(parseInt(`${levelResult.xp || "0"}`))
            .setLevel(parseInt(`${levelResult.level || "1"}`))
            .setProgressBar('#ff5454')
            .setRequiredXP(calculateXP(levelResult.level))
            .setOverlay("#121212")
            .setUsername(`${user.username}`)
            .setDiscriminator(`${user.discriminator}`)
            .setBackground('COLOR', '#121212')
        } else {
            let levelResult = await levelsDB.findOne({GuildID: guild.id, UserID: member.user.id});

            rankcard.setAvatar(member.user.displayAvatarURL({extension: 'png'}))
            .setCurrentXP(parseInt(`${levelResult.xp || "0"}`))
            .setLevel(parseInt(`${levelResult.level || "1"}`))
            .setRequiredXP(calculateXP(levelResult.level))
            .setProgressBar('#ff5454')
            .setOverlay("#121212")
            .setUsername(`${member.user.username}`)
            .setDiscriminator(`${member.user.discriminator}`)
            .setBackground('COLOR', '#121212')
        }

        rankcard.build().then(async data => {
            const atta = new AttachmentBuilder(data).setName("rank.png")
            await interaction.reply({files: [atta]});
        })
    }
}
