const Discord = require('discord.js');
const erela = require('erela.js');

module.exports = {
  commands: 'remove',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<queue number>',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   * @param {erela.Manager} manager 
   */
  callback: async (message, args, text, client, manager) => {
    const { guild } = message;

    const { channel } = message.member.voice;

    if (!channel) {
      return message.reply(`Please join a voice channel!`);
    };

    const player = manager.players.get(guild.id);

    if (!player) return message.reply(`There is no player for this server!`);

    if (channel.id !== player.voiceChannel) {
      return message.reply(`You are not in the same voice channel as the bot`);
    };

    const index = parseInt(text) - 1;

    const trackDeleted = player.queue.splice(index, 1)[0];

    const e = new Discord.MessageEmbed()
    .setTitle(`Track deleted!`)
    .setColor('WHITE')
    .setDescription(`[${trackDeleted.title}](${trackDeleted.uri}) has been deleted from the queue!`)

    message.channel.send({
      embeds: [e],
    });
  },
}