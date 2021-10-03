const { MessageEmbed } = require('discord.js');

module.exports = {
  commands: 'queueloop',
  callback: async function (message, args, text, client, manager) {
    const { guild } = message;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      message.reply(`Please join a voice channel!`);
      return;
    };

    const player = manager.players.get(guild.id);

    if (!player) {
      message.reply(`The bot is not in the voice channel!`);
      return;
    };

    if (!player.playing && !player.paused) {
      message.reply(`There are no songs currently playing!`);
      return;
    };

    if (player.queueRepeat === true) {
      const falseEmbed = new MessageEmbed()
      .setDescription('Queue loop: false')
      .setColor('WHITE')

      message.channel.send({ embeds: [falseEmbed] });
      player.setQueueRepeat(false);
      return;
    } else if (player.queueRepeat === false) {
      const trueEmbed = new MessageEmbed()
      .setDescription('Queue loop: true')
      .setColor('WHITE')

      message.channel.send({ embeds: [trueEmbed] });
      player.setQueueRepeat(true);
      return;
    }
  }
}