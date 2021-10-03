const { DiscordTogether } = require('discord-together');

module.exports = client => {
  return new DiscordTogether(client);
};