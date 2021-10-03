const Discord = require('discord.js');
const erela = require('erela.js');
const playlistSchema = require('../../schemas/playlist-schema');
const tracks = [];

module.exports = {
  commands: 'playlistremove',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<song number from playlist>',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   * @param {erela.Manager} manager 
   */
  callback: async (message, args, text, client, manager) => {
    const { guild, author } = message;

    const playlist = await playlistSchema.findOne({ userId: author.id });

    if (!playlist && !playlist.tracks.length) return message.reply(`Your playlist is empty!`);

    if (!tracks.length) {
      tracks.push(...playlist.tracks);
    };

    if (isNaN(text)) return message.reply(`Please give a valid number!`);

    const number = parseInt(text);

    if (number > tracks.length) return message.reply(`I can't find that song in your playlist!`);

    const tracksSplited = tracks.splice(number - 1);
    const trackDeleted = tracksSplited.splice(0, 1);

    for (const track of tracksSplited) {
      track.number = track.number - 1;
    };

    tracks.push(...tracksSplited);

    await playlistSchema.findOneAndUpdate(
      {
        userId: author.id,
      },
      {
        userId: author.id,
        tracks,
      },
      {
        upsert: true,
      }
    );

    const e = new Discord.MessageEmbed()
    .setThumbnail(trackDeleted[0].thumbnail)
    .setColor('WHITE')
    .setTitle(`Song #${trackDeleted[0].number} deleted`)
    .setDescription(`[${trackDeleted[0].title}](${trackDeleted[0].uri}) has been removed from your playlist successfully!`)

    message.reply({ embeds: [e] });
  }
}