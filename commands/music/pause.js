module.exports = {
  commands: 'pause',
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

    if (player.paused) {
      message.reply(`The song is already paused!`);
      return;
    };

    message.react('⏸️').then(function () {
      player.pause(true);
    })
  }
}