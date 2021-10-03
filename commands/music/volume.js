const Discord = require('discord.js');
const Erela = require('erela.js');

module.exports = {
  commands: 'volume',
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '[number: 1 - 100]',
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

    if (!player) {
      message.reply(`There is no player for this server!`);
      return;
    };

    if (!args.length) return message.reply(`The player volume is \`${player.volume} / 100\`!`);

    const { channel } = message.member.voice;

    if (!channel) return message.reply(`Please join a voice channel!`);
    if (channel.id !== player.voiceChannel) return message.reply(`You're not in the same voice channel!`);

    const volume = parseInt(args[0]);

    if (!volume || volume < 1 || volume > 100) return message.reply(`The minimum volume is \`1\` and the maximum volume is \`100\`!`);

    player.setVolume(volume);

    message.channel.send(`Volume of the player is set to: \`${volume.toLocaleString()} / 100\`!`);
  }
}