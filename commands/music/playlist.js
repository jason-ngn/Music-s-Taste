const Discord = require('discord.js');
const Erela = require('erela.js');
const backId = 'back';
const forwardId = 'forward';
const playlistSchema = require('../../schemas/playlist-schema');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  commands: 'playlist',
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '[user tag]',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   * @param {Erela.Manager} manager 
   */
  callback: async (message, args, text, client, manager) => {
    const { guild } = message;

    const backButton = new Discord.MessageButton({
      style: 'SECONDARY',
      label: 'Back',
      emoji: '⬅️',
      customId: backId,
    });
    const forwardButton = new Discord.MessageButton({
      style: 'SECONDARY',
      label: 'Forward',
      emoji: '➡️',
      customId: forwardId,
    });
    
    const target = message.mentions.users.first() || message.author

    const playlist = await playlistSchema.findOne({ userId: target.id }) || {
      tracks: [],
    };

    if (target.bot) return message.reply(`That user is a bot, and bots can't listen to music...`);

    /**
     * 
     * @param {number} start
     * @returns {Promise<Discord.MessageEmbed>} 
     */
    const generateEmbed = async start => {
      const tracks = playlist.tracks.slice(start, start + 10);

      const pageNumber = Math.ceil((start + 10) / 10)
      const maxPages = Math.ceil(playlist.tracks.length / 10);

      return new Discord.MessageEmbed()
      .setTitle(`${target.username}'s playlist!`)
      .setColor('WHITE')
      .setThumbnail(target.displayAvatarURL())
      .setDescription(tracks.map(track => (`${track.number.toLocaleString()} - [${track.title}](${track.uri}) **[${track.author}] [${moment.duration(track.duration).format('HH:mm:ss')}]**`)).join('\n\n'))
      .setFooter(`Page ${pageNumber} of ${maxPages.toLocaleString()} • Expires in 1 minute`)

    };

    const canFitOnOnePage = playlist.tracks.length <= 10;
    const embedMessage = await message.channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ? [] : [new Discord.MessageActionRow({ components: [new Discord.MessageButton().setDisabled(true).setLabel('Back').setEmoji('⬅️').setStyle('SECONDARY').setCustomId(backId), forwardButton] })],
    });

    if (canFitOnOnePage) return;

    const collector = embedMessage.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id && [backId, forwardId].includes(interaction.customId),
    });

    let currentIndex = 0;
    collector.on('collect', async interaction => {
      interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);

      await interaction.update({
        embeds: [await generateEmbed(currentIndex)],
        components: [
          new Discord.MessageActionRow({ components: [
            ...(currentIndex ? [backButton] : [new Discord.MessageButton().setDisabled(true).setLabel('Back').setEmoji('⬅️').setStyle('SECONDARY').setCustomId(backId)]),
            ...(currentIndex + 10 < playlist.tracks.length ? [forwardButton] : [new Discord.MessageButton().setDisabled(true).setLabel('Forward').setEmoji('➡️').setStyle('SECONDARY').setCustomId(forwardId)])
          ]})
        ]
      });
    });
  }
}