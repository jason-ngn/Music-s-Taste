const Discord = require('discord.js');
const Erela = require('erela.js');
const backId = 'back';
const forwardId = 'forward';
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  commands: 'queue',
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

    const player = manager.players.get(guild.id);

    if (!player) return message.reply(`There is no player for this server!`);

    const backButton = new Discord.MessageButton({
      style: 'SECONDARY',
      label: 'Back',
      emoji: '⬅️',
      customId: backId
    });
    const forwardButton = new Discord.MessageButton({
      style: "SECONDARY",
      label: 'Forward',
      emoji: '➡️',
      customId: forwardId,
    });

    /**
     * 
     * @param {number} start 
     * @returns {Discord.MessageEmbed}
     */
    const generateEmbed = async start => {
      const tracks = player.queue.slice(start, start + 10);

      const pageNumber = Math.ceil((start + 10) / 10);
      const maxPages = Math.ceil(player.queue.length / 10);

      return new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`${guild.name}'s queue!`)
      .setColor("WHITE")
      .setDescription(player.queue.length ? (tracks.map((track, i) => (`${(start + (++i))} - [${track.title}](${track.uri})\nRequested by: <@${track.requester.id}>`))).join('\n\n') : 'No tracks in the queue!')
      .addFields({
        name: 'Current:',
        value: `[${player.queue.current.title}](${player.queue.current.uri})\nRequested by: <@${player.queue.current.requester.id}>`,
      })
      .setFooter(`Page ${pageNumber} of ${maxPages.toLocaleString()}`)
    };

    const canFitOnOnePage = player.queue.length <= 10;
    const embedMessage = await message.channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ? [] : [new Discord.MessageActionRow({ components: [new Discord.MessageButton().setDisabled(true).setLabel('Back').setEmoji('⬅️').setStyle('SECONDARY').setCustomId(backId), forwardButton] })],
    });

    if (canFitOnOnePage) return;

    const collector = embedMessage.createMessageComponentCollector({
      filter: interaction => interaction.user.id === message.author.id && [backId, forwardId].includes(interaction.customId),
    });

    let currentIndex = 0;
    collector.on('collect', async interaction => {
      interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10);

      await interaction.update({
        embeds: [await generateEmbed(currentIndex)],
        components: [
          new Discord.MessageActionRow({ components: [
            ...(currentIndex ? [backButton] : [new Discord.MessageButton().setDisabled(true).setLabel('Back').setEmoji('⬅️').setStyle('SECONDARY').setCustomId(backId)]),
            ...(currentIndex + 10 < player.queue.length ? [forwardButton] : [new Discord.MessageButton().setDisabled(true).setLabel('Forward').setEmoji('➡️').setStyle('SECONDARY').setCustomId(forwardId)]),
          ]})
        ]
      })
    })
  }
}