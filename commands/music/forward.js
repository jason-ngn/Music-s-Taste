const Discord = require('discord.js');
const Erela = require('erela.js');
const moment = require('moment');
require('moment-duration-format');
const fastForwardNum = 10;

module.exports = {
  commands: ['forward', 'fastforward'],
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '[time]',
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

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      message.reply(`Please join a voice channel!`);
      return;
    };

    const player = manager.players.get(guild.id);

    if (!player) {
      message.reply(`There is no player in the server!`);
      return;
    };

    if (args[0]) {
      if (!args[0].includes(':')) {
        return message.reply(`Incorrect format! Please use: \`HH:MM:SS\``);
      };

      const time = moment.duration(args[0]).asSeconds();

      if ((time * 1000) < player.queue.current.duration) {
        player.seek(time * 1000);
        const parsedDuration = moment.duration(player.position).format('hh:mm:ss');
        message.reply(`Fast-forwarded to \`${parsedDuration}\``);
        return;
      } else {
        return message.reply(`Can't forward beyond the song's duration!`);
      };
    };

    if (!args[0]) {
      if ((player.position + fastForwardNum * 1000) < player.queue.current.duration) {
        player.seek(player.position + fastForwardNum * 1000);
        const parsedDuration = moment.duration(player.position).format('hh:mm:ss');
        return message.reply(`Fast-forwarded to \`${parsedDuration}\``);
      } else {
        return message.reply(`Incorrect format! Please use: \`HH:MM:SS\``);
      };
    }
  }
};