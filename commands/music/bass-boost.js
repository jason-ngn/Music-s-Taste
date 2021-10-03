const Discord = require('discord.js');
const erela = require('erela.js');

module.exports = {
  commands: 'bassboost',
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '[bass level: -0.25 - 1.00]',
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

    if (!channel) return message.reply(`Please join a voice channel!`);
    
    const player = manager.players.get(guild.id);

    if (!player) return message.reply(`There is no player for this server!`);
    if (channel.id !== player.voiceChannel) return message.reply(`You're not in the same voice channel!`);

    if (!player.playing && !player.paused) {
      return message.reply(`No songs is currently playing!`);
    };

    if (!text) {
      return message.channel.send(`Bassboost level: \`${player.bands[0]} / 1.00\``);
    };

    const bassboost = parseFloat(text);

    if (bassboost < -0.25 || bassboost > 1) {
      return message.reply(`Bassboost level has to be lower than -0.25 or higher than 1.00!`);
    }

    const bands = new Array(3).fill(null).map((_, i) => ({ band: i, gain: bassboost }));

    await player.setEQ(...bands);

    message.channel.send(`Bassboost level set to: \`${bassboost} / 1.00\``);
  }
}