const Discord = require('discord.js')
const config = require('./config.json')

const timeHelper = require('./time-helper')

module.exports.start = async (bot) => {
    const globalDeleteLog = bot.guilds.cache.get(config.developerServerId).channels.cache.get(config.globalDeleteLogChannel)

    bot.on('messageDelete', async (messageDelete) => {
        if (!messageDelete.member) { return } //NO DMs!

        if (messageDelete.log === false) {
            console.log('MESSAGE IGNORED', messageDelete.content)
            return
        }

        const time = timeHelper.getFormattedMilitaryTimeMill()

        const deletedEmbed = new Discord.MessageEmbed({
            description: `**Message sent by <@${messageDelete.author.id}> deleted in ${messageDelete.channel}**\n` + `${messageDelete.content || "?"}`,
            color: '#ff0000'
        }).setAuthor(messageDelete.author.tag, messageDelete.member.user.displayAvatarURL())
            .setFooter(`${messageDelete.guild.name} | Message ID: ${messageDelete.id} • Today at ${time}`, messageDelete.guild.iconURL())

        const globalDeletedEmbed = new Discord.MessageEmbed({
            description: `**Message sent by ${messageDelete.member.user.tag} deleted in ${messageDelete.channel.name}**\n` + `${messageDelete.content || "?"}`,
            color: '#ff0000'
        }).setAuthor(messageDelete.author.tag, messageDelete.member.user.displayAvatarURL())
            .setFooter(`${messageDelete.guild.name} | Message ID: ${messageDelete.id} • Today at ${time}`, messageDelete.guild.iconURL())

        const deleteChannel = messageDelete.guild.channels.cache.find(x => x.name === "delete-log" || x.name === "logs")
        if (deleteChannel)
            deleteChannel.send(deletedEmbed)

        globalDeleteLog.send(messageDelete.guild.id === config.developerServerId ? deletedEmbed : globalDeletedEmbed)
    })
}
