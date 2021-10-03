const Discord = require('discord.js');
const DiscordVoice = require('@discordjs/voice');
const yesId = 'yes';
const noId = 'no';
const path = require('path');

module.exports = {
  commands: 'iloveyou',
  minArgs: 1,
  maxArgs: 1,
  expectedArgs: '<@user tag>',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   */
  callback: async (message, args, text, client) => {
    const { guild, member } = message;

    let target = args[0];

    if (target.includes('<@!')) {
      target = target.replace('<@!', '').replace('>', '');
    }

    const targetMember = (await guild.members.fetch()).get(target);

    if (targetMember.user.bot) return message.reply(`Hey, you can't marry a bot...`);

    if (!member.voice.channel || !targetMember.voice.channel) {
      return message.channel.send(`<@${member.user.id}>, <@${targetMember.user.id}>, Please join a voice channel for the surprise from the owner of the bot!`);
    };

    const willYouMarryMe = new Discord.MessageEmbed()
    .setTitle('💍 Will you marry me?')
    .setColor('WHITE')
    .setDescription(`<@${message.author.id}> has wanted to marry you! Will you accept his proposal?`)

    const player = DiscordVoice.createAudioPlayer();
    const resource = DiscordVoice.createAudioResource(path.join(__dirname, '../../wedding-music.mp3'));

    const connection = DiscordVoice.joinVoiceChannel({
      channelId: member.voice.channel.id || targetMember.voice.channel.id,
      guildId: guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(DiscordVoice.AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    player.on(DiscordVoice.VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
      await connection.destroy();
    });

    const yesButton = new Discord.MessageButton()
    .setCustomId(yesId)
    .setLabel('YESSS!!!')
    .setEmoji('❤️')
    .setStyle('SUCCESS')

    const noButton = new Discord.MessageButton()
    .setCustomId(noId)
    .setLabel('No :(')
    .setStyle('DANGER')
    .setEmoji('😢')

    const row = new Discord.MessageActionRow().addComponents(
      yesButton,
      noButton,
    );

    const sendEmbed = await message.channel.send({
      content: `<@${targetMember.user.id}>`,
      embeds: [willYouMarryMe],
      components: [row],
    });
    
    const filter = i => i.user.id === targetMember.user.id;

    const collector = sendEmbed.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector.on('end', async interaction => {
      await interaction.first().deferUpdate();

      const id = interaction.first().customId;

      if (id === 'yes') {
        const marriedEmbed = new Discord.MessageEmbed()
        .setColor('WHITE')
        .setTitle('🎉 CONGRATULATIONS!!! 🎉')
        .setDescription(`<@${message.author.id}> and <@${targetMember.user.id}> is now a couple!!!!`)

        await interaction.first().editReply({
          content: `<@${message.author.id}>, <@${targetMember.user.id}>`,
          embeds: [marriedEmbed],
          components: [],
        });
        await connection.destroy();
        return;
      } else if (id === 'no') {
        const notMarriedEmbed = new Discord.MessageEmbed()
        .setTitle(`Well that's sad :(`)
        .setColor(`WHITE`)
        .setDescription(`<@${targetMember.user.id}> has refused the proposal :(`)

        await interaction.first().editReply({
          content: `<@${message.author.id}>, <@${targetMember.user.id}>`,
          embeds: [notMarriedEmbed],
          components: [],
        });
        await connection.destroy();
        return;
      }
    });
  }
}