const { Client, GuildMember, AttachmentBuilder } = require('discord.js')
const { Captcha } = require('captcha-canvas')
const DB = require('../../models/CaptchaSystem')
const { EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    name: "guildMemberAdd",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     * @param { GuildMember } member
     */
    async execute(member, client) {

        DB.findOne({ GuildID: member.guild.id }, async (err, data) => {
            if (!data) return console.log("No data was found!")

            const captcha = new Captcha();
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            const captchaAttachment = new AttachmentBuilder(await captcha.png).setName('captcha.png')
            
            const captchaEmbed = new EmbedBuilder()
            .setColor(client.mainColor)
            .setDescription("Please complete this captcha within 30 seconds!")
            .setImage('attachment://captcha.png')

            try {
                const msg = await member.user.send({files: [captchaAttachment], embeds: [captchaEmbed]})

                const wrongCaptchaEmbed = new EmbedBuilder()
                .setColor(client.errorColor)
                .setDescription("🚫 Wrong Captcha");

                const filter = (message) => {
                    if(message.author.id !== member.id) return;
                    if(message.content === captcha.text) {
                        return true;
                    } else {
                        member.send({embeds: [wrongCaptchaEmbed]})
                    }
                }

                try {
                    const response = await msg.channel.awaitMessages({
                        filter: filter,
                        max: 1,
                        time: 30*1000,
                        errors: ["time"]});

                    if(response) {
                        DB.findOne({ GuildID: member.guild.id }, async (err, data) => {
                            if(!data) return;
                            if(!data.Role) return;

                            const role = member.guild.roles.cache.get(data.Role)
                            member.roles.add(role)
                            member.send("`✅ You have been successfully verified!`");
                        })
                    } else {
                        // No time and not verified
                        await member.send("`🔱 You didn't verified so I had to kick you!`")
                        member.kick("didn't answered verify!")
                    }
                } catch(err) {
                    return console.error(err)
                }
            } catch (err) {
                return console.error(err)
            }

        })

    }
}