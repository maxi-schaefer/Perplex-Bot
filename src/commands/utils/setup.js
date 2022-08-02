const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

const voiceDB = require('../../models/VoiceSystem')
const captchaDB = require('../../models/CaptchaSystem')
const modlogsDB = require('../../models/ModerationLogs')
const featuresDB = require('../../models/Features')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Setup some settings!")
    .addSubcommand(
        command =>
        command.setName("voice")
        .setDescription("Setup voice configuration")
        .addChannelOption(
            channel =>
            channel.setName("channel")
            .setDescription("The join to create Channel!")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
    ))
    .addSubcommand(
        command =>
        command.setName("levels")
        .setDescription("Enable or disable the levels!")
        .addStringOption(
            option =>
            option.setName("turn")
            .setDescription("Enable or Disable the level System")
            .addChoices(
                { name: "On", value: "on" },
                { name: "Off", value: "off" },
            ))
        .addStringOption(
            option =>
            option.setName("background")
            .setDescription("Change the rank card background! (Needs to be a valid link )")
            .setMinLength(2)))
    .addSubcommand(
        command =>
        command.setName("modlogs")
        .setDescription("Setup modlogs configuration")
        .addChannelOption(
            channel =>
            channel.setName("log")
            .setDescription("The log Channel!")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    ))
    .addSubcommand(
        command =>
        command.setName("captcha")
        .setDescription("Setup captcha configuration")
        .addRoleOption(
            option =>
            option.setName("role")
            .setDescription("The role a verified user gets!")
            .setRequired(true))
        .addChannelOption(
            option => 
            option.setName("captcha_channel")
            .setDescription("There is a message coming...")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        ))
    .addSubcommand(
        command =>
        command.setName("info")
        .setDescription("Get Information about your configurations!"))
    .addSubcommand(
        command =>
        command.setName("remove")
        .setDescription("Remove configurations!")
        .addStringOption(
            option =>
            option.setName("configuration")
            .setDescription("The configuration you want to remove!")
            .setRequired(true)
            .addChoices(
                { name: '🤖 Captcha', value: 'captcha' },
                { name: '🔊 Voice', value: 'voice' },
                { name: '📕 Modlogs', value: 'modlogs' },
            ))),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild } = interaction;

        const channel = options.getChannel("channel")
        const role = options.getRole("role")
        const type = options.getString("configuration")

        const sub = options.getSubcommand();

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTitle("✨ Setup")
        .setTimestamp(Date.now())
        .setDescription("Here can you see your current settings!")

        switch(sub) {
            case "voice": {
                await voiceDB.findOneAndUpdate(
                    {GuildID: guild.id}, 
                    {ChannelID: channel.id},
                    {new: true, upsert: true})
                
                Response.setDescription("✅ Successfully set up the voice system!")
            }
            break;

            case "levels": {
                const background = options.getString("background");
                const level_enabled = await featuresDB.findOne({GuildID: guild.id});
                if(level_enabled) {
                    const { LevelSystem } = level_enabled;

                    if(background) {
                        if(isValidHttpUrl(background)) {
                            await featuresDB.findOneAndUpdate(
                                {GuildID: guild.id},
                                {LevelSystem: {
                                     Enabled: LevelSystem ? 
                                     LevelSystem.Enabled : 
                                     false,
                                     Background: background 
                                }},
                                {new: true, upsert: true}
                            )
        
                            Response
                            .setDescription("🖼️ New Background set!")
                            .setImage(background);
                        } else {
                            Response.setDescription("❌ `background` needs to be a valid link!") 
                            return interaction.reply({embeds: [Response], ephemeral: true})
                        }
                    }

                    switch(options.getString("turn")) {

                        case "on": {
                            await featuresDB.findOneAndUpdate(
                                {GuildID: guild.id},
                                {LevelSystem: { Enabled: true, Background: LevelSystem ? LevelSystem.Background : "https://cdn.discordapp.com/attachments/965674056080826368/1003622130921001040/background.png" }},
                                {new: true, upsert: true})
    
                            Response.setDescription("✅ Successfully enabled the levels system!")
                        }
                        break;
    
                        case "off": {
                            await featuresDB.findOneAndUpdate(
                                {GuildID: guild.id},
                                {LevelSystem: { Enabled: true, Background: LevelSystem ? LevelSystem.Background : "https://cdn.discordapp.com/attachments/965674056080826368/1003622130921001040/background.png" }},
                                {new: true, upsert: true})
    
                            Response.setDescription("✅ Successfully disabled the levels system!")
                        }
                        break;
                    }
                } else {
                    await featuresDB.findOneAndUpdate(
                        {GuildID: guild.id},
                        {LevelSystem: { Enabled: false, Background: "https://cdn.discordapp.com/attachments/965674056080826368/1003622130921001040/background.png"}},
                        {new: true, upsert: true})
                    Response.setDescription("Set up the Level System, use `/setup levels turn: On` to turn it on, \n or use `/setup levels background: 'url'` to change the rankcard background!");
                }
            }
            break;

            case "captcha": {
                const button = new ButtonBuilder()
                .setCustomId("captcha-btn")
                .setLabel("✅ Verify")
                .setStyle(ButtonStyle.Success);

                const captcha_channel = options.getChannel("captcha_channel")
                const captcha_embed = new EmbedBuilder()
                .setColor(client.mainColor)
                .setTitle("🤖 Captcha")
                .setDescription("Please Click on `✅ Verify` and solve the captcha within 30 seconds!")

                await captchaDB.findOneAndUpdate(
                    {GuildID: guild.id},
                    {Role: role.id},
                    {new: true, upsert: true})

                Response.setDescription("✅ Successfully set up the captcha system!")
                captcha_channel.send({embeds: [captcha_embed], components: [new ActionRowBuilder().addComponents(button)]});
            }
            break;

            case "modlogs": {
                const modChannel = options.getChannel("log")

                await modlogsDB.findOneAndUpdate(
                    {GuildID: guild.id},
                    {ChannelID: modChannel.id},
                    {new: true, upsert: true})

                Response.setDescription("✅ Successfully set up the modlog system!")
            }
            break;

            case "info": {

                let captchaStatus = '`🔴 Off`'
                let voiceStatus = '`🔴 Off`'
                let modlogStatus = '`🔴 Off`'
                let levelSystemStatus = '`🔴 Off`'

                const levelSystemCheck = await featuresDB.findOne({GuildID: guild.id})
                if(levelSystemCheck) {
                    const { LevelSystem } = levelSystemCheck
                    if(LevelSystem.Enabled) levelSystemStatus = '`🟢 On`' 
                } else{
                    levelSystemStatus = '`🔴 Off`'
                }

                const voiceCheck = await voiceDB.findOne({GuildID: guild.id})
                if(voiceCheck) voiceStatus = '`🟢 On`'

                const captchaCheck = await captchaDB.findOne({GuildID: guild.id})
                if(captchaCheck) captchaStatus = '`🟢 On`'

                const modlogCheck = await modlogsDB.findOne({GuildID: guild.id})
                if(modlogCheck) modlogStatus = '`🟢 On`'

                await Response.addFields([
                    {name: '🤖 Captcha', value: captchaStatus, inline: true },
                    {name: '🔊 Voice', value: voiceStatus, inline: true },
                    {name: '📕 Mod Log', value: modlogStatus, inline: true },
                    {name: '🎉 Level System', value: levelSystemStatus, inline: true },
                ])
            }
            break;

            case "remove": {
                switch(type) {
                    case "captcha": {
                        captchaDB.findOneAndDelete({ GuildID: guild.id }, (err) => {
                            if(err) console.error(err)
                        });
                        Response.setDescription("🗑️ Successfully removed the captcha system!")
                    }
                    break;

                    case "voice": {
                        voiceDB.findOneAndDelete({ GuildID: guild.id }, (err) => {
                            if(err) console.error(err)
                        });
                        Response.setDescription("🗑️ Successfully removed the voice system!")
                    }
                    break;

                    case "modlogs": {
                        modlogsDB.findOneAndDelete({ GuildID: guild.id }, (err) => {
                            if(err) console.error(err)
                        });
                        Response.setDescription("🗑️ Successfully removed the modlogs system!")
                    }
                    break;
                }
            }
        }

        await interaction.reply({embeds: [Response], ephemeral: true})
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false
    }

    return url.protocol === "https:" || url.protocol === "http:";
}