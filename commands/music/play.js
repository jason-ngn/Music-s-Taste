const Discord = require('discord.js');

module.exports = {
  commands: 'play',
  minArgs: 1,
  expectedArgs: '<query or link>',
  clientPermissions: [
    'CONNECT',
    'SPEAK',
  ],
  callback: async (message, args, text, client, manager) => {
    const { guild, author } = message;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      message.reply(`Please join a voice channel!`);
      return;
    };

    const res = await manager.search(
      text,
      author,
    );

    const player = manager.create({
      guild: guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: message.channel.id,
    });

    player.queue.add(res.tracks[0]);
    
    if (!player.playing && !player.paused) {
      player.connect();
      player.play();
    } else {
      const embed = new Discord.MessageEmbed()
      .setDescription(`Queued [${res.tracks[0].title}](${res.tracks[0].uri})\nRequested by <@${res.tracks[0].requester.id}>`)
      .setThumbnail(res.tracks[0].displayThumbnail(1500))
      .setColor('WHITE')
      
      message.channel.send({ embeds: [embed] });
    }
  }
}