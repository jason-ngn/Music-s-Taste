const Discord = require('discord.js');

module.exports = async (client, manager) => {
  manager.on('trackStart', async (player, track) => {
    const guild = client.guilds.cache.get(player.guild);

    const channel = guild.channels.cache.get(player.textChannel);

    const embed = new Discord.MessageEmbed()
    .setTitle('Now playing:')
    .setDescription(`[${track.title}](${track.uri})\nRequested by: <@${track.requester.id}>`)
    .setThumbnail(track.displayThumbnail(1500))
    .setColor('WHITE')

    channel.send({ embeds: [embed] });
  })
}