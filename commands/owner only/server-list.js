const Discord = require('discord.js');
const commandHandler = require('../../handlers/command-handler');

module.exports = {
  commands: 'serverlist',
  ownerOnly: true,
  callback: async (message, args, text, client) => {
    const { guild } = message;
    const prefix = await commandHandler.getPrefix(guild);

    const embed = new Discord.MessageEmbed()
    .setTitle('List of servers')
    .setDescription(`Number of servers: ${client.guilds.cache.size.toLocaleString()}`);
    
    for (const guild of client.guilds.cache) {
      embed.addFields(
        {
          name: guild[1].name,
          value: `ID: ${guild[1].id}\nMember Count: ${guild[1].memberCount}\nOwner: <@${guild[1].ownerId}>\nPrefix: \`${prefix}\``,
        }
      );
    }

    message.reply({ embeds: [embed] });
  }
}