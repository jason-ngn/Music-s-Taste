const Discord = require('discord.js');
const erela = require('erela.js');
const playlistSchema = require('../../schemas/playlist-schema');

module.exports = {
  commands: 'playlistload',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   * @param {erela.Manager} manager 
   */
  callback: async (message, args, text, client, manager) => {
    const { guild } = message;

    const { channel } = message.member.voice;

    if (!channel) return message.reply(`Please join a voice channel!`);

    let player = manager.players.get(guild.id);

    if (!player) {
      player = await manager.create({
        guild: guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
      });
    };

    const playlist = await playlistSchema.findOne({ userId: message.author.id });

    if (!playlist) return message.reply(`Your playlist is empty!`);

    const tracksSearched = [];

    message.reply(`Loading your playlist...`).then(async msg => {
      for (const track of playlist.tracks) {
        const res = await manager.search(
          track.uri,
          message.author,
        );
  
        tracksSearched.push(res.tracks[0]);
      };
  
      for (const track of tracksSearched) {
        player.queue.add(track);
      };
  
      const e = new Discord.MessageEmbed()
      .setTitle(`Songs added!`)
      .setColor('WHITE')
      .setDescription(`${playlist.tracks.length.toLocaleString()} songs added to the queue successfully!`);

      msg.channel.send({ embeds: [e] });

      if (!player.playing && !player.paused) {
        player.connect();
        player.play();
      }
    });
  }
}