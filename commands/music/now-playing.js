const discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  commands: 'nowplaying',
  callback: async (message, args, text, client, manager) => {
    const { guild } = message;

    const player = manager.players.get(guild.id);

    if (!player) {
      message.reply(`There are no songs currently playing!`);
      return;
    };

    if (!player.queue.current) {
      message.reply(`There are no songs currently playing!`);
      return;
    };

    const currentSong = player.queue.current;

    const durationTime = moment.duration(currentSong.duration).format('hh:mm:ss');

    const nowPlayingEmbed = new discord.MessageEmbed()
    .setColor('WHITE')
    .setTitle(`Currently playing`)
    .setThumbnail(currentSong.displayThumbnail(1500))
    .addFields(
      {
        name: 'Title:',
        value: `[${currentSong.title}](${currentSong.uri})`,
      },
      {
        name: 'Requested by:',
        value: `<@${currentSong.requester.id}>`,
        inline: true,
      },
      {
        name: 'Duration:',
        value: `\`${moment.duration(player.position).format('HH:mm:ss')} / ${durationTime}\``,
        inline: true,
      },
      {
        name: 'Author:',
        value: currentSong.author,
        inline: true,
      },
      {
        name: 'Volume:',
        value: `\`${player.volume} / 100\``,
        inline: true,
      },
      {
        name: 'Bassboost level:',
        value: `\`${player.bands[0]} / 1.00\``,
        inline: true,
      },
      {
        name: 'Loop:',
        value: player.trackRepeat === true ? 'True' : 'False',
        inline: true,
      }
    );

    message.reply({ embeds: [nowPlayingEmbed] });
  }
}