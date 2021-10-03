const axios = require('axios').default;
const Discord = require('discord.js');

module.exports = client => {};

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports.putBotInfo = async function (client) {
  await axios.put('http://localhost:3001/api/botinfo', {
    botId: client.user.id,
    botTag: client.user.tag,
    botGuilds: client.guilds.cache.size,
    botUsers: client.users.cache.size,
    botChannels: client.channels.cache.size,
  }, {
    withCredentials: true,
  });
};