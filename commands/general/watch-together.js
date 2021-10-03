const { DiscordTogether } = require('discord-together');
const Discord = require('discord.js');

module.exports = {
  commands: 'watchtogether',
  description: 'To watch youtube videos together!',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<voice channel ID>',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   */
  callback: async (message, args, text, client) => {
    const { guild } = message;
    const channelId = args[0];

    const channel = guild.channels.cache.get(channelId);

    if (channel.type !== 'GUILD_VOICE' && channel.type !== 'GUILD_STAGE_VOICE') {
      return message.reply(`Please join a voice channel or a stage channel!`);
    };

    client.watchTogether.createTogetherCode(channelId, 'youtube').then(x => {
      return message.reply(`The code is: <${x.code}>`);
    })
  }
}