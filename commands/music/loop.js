const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: 'loop',
  callback: async (message, args, text, client, manager) => {
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

    if (player.trackRepeat === true) {
      const trueEmbed = new MessageEmbed()
      .setDescription(`Loop: false`)
      .setColor('WHITE')

      message.channel.send({ embeds: [trueEmbed] });
      player.setTrackRepeat(false);
      return;
    } else if (player.trackRepeat === false) {
      const falseEmbed = new MessageEmbed()
      .setDescription(`Loop: true`)
      .setColor('WHITE')

      message.channel.send({ embeds: [falseEmbed] });
      player.setTrackRepeat(true);
      return;
    }
  }
}