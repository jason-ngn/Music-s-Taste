const Discord = require('discord.js');

module.exports = {
  commands: 'disconnect',
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

    const disconnectEmbed = new Discord.MessageEmbed()
    .setDescription('Clears the queue, resets the player!')
    .setColor('WHITE')

    await message.reply({ embeds: [disconnectEmbed] });
    player.destroy();
  }
}