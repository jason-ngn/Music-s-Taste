const Discord = require('discord.js');
const Erela = require('erela.js');

module.exports = {
  commands: 'skipto',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<number in queue>',
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

    if (isNaN(args[0])) return message.reply(`That is an invalid number!`);

    const number = parseInt(args[0]);

    if (number === 0) return message.reply(`Can't skip to a song that is already playing!`);

    if ((number > player.queue.length) || (number && !player.queue[number - 1])) return message.reply(`I can't find that song!`);

    const { title, uri, requester } = player.queue[number - 1];

    if (number === 1) player.stop();

    player.queue.splice(0, number - 1);
    player.stop();

    const e = new Discord.MessageEmbed()
    .setColor('WHITE')
    .setDescription(`Skipped to [${title}](${uri})\nRequested by: <@${requester.id}>`)

    return message.reply({ embeds: [e] });
  }
}