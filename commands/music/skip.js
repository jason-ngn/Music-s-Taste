const Discord = require('discord.js');

module.exports = {
  commands: 'skip',
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

    if (player.queue.size < 1) {
      message.reply(`This is the only song in the queue!`);
      return;
    };

    message.react('⏭️').then(() => {
      player.stop();
    })
  },
}