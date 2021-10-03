const Discord = require('discord.js');
const Erela = require('erela.js');
const playlistSchema = require('../../schemas/playlist-schema');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  commands: 'playlistadd',
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: '[queue number]',
  /**
   * 
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {string} text 
   * @param {Discord.Client} client 
   * @param {Erela.Manager} manager 
   */
  callback: async (message, args, text, client, manager) => {
    const { guild } = message;

    const { channel } = message.member.voice;

    if (!channel) return message.reply(`Please join a voice channel!`);

    const player = manager.players.get(guild.id);

    if (!player) return message.reply(`There is no player for this server!`);

    const numbers = await playlistSchema.findOne({ userId: message.author.id }) || {
      tracks: [],
    };

    if (text) {
      const number = parseInt(text);
      const index = number - 1

      const track = player.queue[index];
      if (!track) return message.reply(`I can't find that track!`);

      const trackToBePushed = {
        number: numbers.tracks.length + 1,
        title: track.title,
        uri: track.uri,
        author: track.author,
        duration: track.duration,
        thumbnail: track.thumbnail,
      };

      const findAlreadyAdded = await playlistSchema.findOne({ userId: message.author.id });
      if (findAlreadyAdded) {
        if (findAlreadyAdded.tracks.length) {
          const filteredTrack = findAlreadyAdded.tracks.filter(track => {
            return track.uri === trackToBePushed.uri && track.title === trackToBePushed.title;
          });
          
          if (filteredTrack.length) {
            const alreadyAddedEmbed = new Discord.MessageEmbed()
            .setColor('WHITE')
            .setTitle('Already added')
            .setDescription(`[${trackToBePushed.title}](${trackToBePushed.uri}) had been added your playlist before! Do you wanna add anyway?`)

            const row = new Discord.MessageActionRow()
            .addComponents(
              new Discord.MessageButton()
              .setCustomId('yes')
              .setLabel('YES')
              .setStyle('SUCCESS'),
              new Discord.MessageButton()
              .setCustomId('no')
              .setLabel('NO')
              .setStyle('DANGER'),
            );

            await message.reply({ embeds: [alreadyAddedEmbed], components: [row] }).then(async () => {
              const filter = (interaction) => {
                return ['yes', 'no'].includes(interaction.customId) && interaction.user.id === message.author.id;
              };

              const collector = message.channel.createMessageComponentCollector({ 
                filter,
                max: 1,
              });

              collector.on('end', async (interaction) => {
                await interaction.first().deferUpdate();
                const id = interaction.first().customId;

                if (id === 'yes') {
                  await playlistSchema.findOneAndUpdate(
                    {
                      userId: message.author.id,
                    },
                    {
                      userId: message.author.id,
                      $push: {
                        tracks: trackToBePushed,
                      }
                    },
                    {
                      upsert: true,
                    }
                  );

                  const addedEmbed = new Discord.MessageEmbed()
                  .setDescription(`[${trackToBePushed.title}](${trackToBePushed.uri})has been added to your playlist!`)
                  .setColor('WHITE')

                  await interaction.first().editReply({ embeds: [addedEmbed], components: [] });

                  const e = new Discord.MessageEmbed()
                  .setTitle(`Song #${trackToBePushed.number}`)
                  .setColor('WHITE')
                  .setThumbnail(trackToBePushed.thumbnail)
                  .addFields(
                    {
                      name: `Title:`,
                      value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
                    },
                    {
                      name: 'Author:',
                      value: trackToBePushed.author,
                      inline: true,
                    },
                    {
                      name: 'Duration:',
                      value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
                      inline: true,
                    }
                  );

                  return message.author.send({ embeds: [e] });
                } else if (id === 'no') {
                  const notAddedEmbed = new Discord.MessageEmbed()
                  .setDescription(`Alright, we got it!`)
                  .setColor("WHITE")

                  return interaction.first().editReply({ embeds: [notAddedEmbed], components: [] });
                }
              })
            });
          } else {
            await playlistSchema.findOneAndUpdate(
              {
                userId: message.author.id,
              },
              {
                userId: message.author.id,
                $push: {
                  tracks: trackToBePushed,
                }
              },
              {
                upsert: true,
              }
            );
      
            const e = new Discord.MessageEmbed()
            .setTitle(`Song #${trackToBePushed.number}`)
            .setColor('WHITE')
            .setThumbnail(trackToBePushed.thumbnail)
            .addFields(
              {
                name: `Title:`,
                value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
              },
              {
                name: 'Author:',
                value: trackToBePushed.author,
                inline: true,
              },
              {
                name: 'Duration:',
                value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
                inline: true,
              }
            );
      
            message.author.send({ embeds: [e] });
            return;
          }
        } else {
          await playlistSchema.findOneAndUpdate(
            {
              userId: message.author.id,
            },
            {
              userId: message.author.id,
              $push: {
                tracks: trackToBePushed,
              }
            },
            {
              upsert: true,
            }
          );
    
          const e = new Discord.MessageEmbed()
          .setTitle(`Song #${trackToBePushed.number}`)
          .setColor('WHITE')
          .setThumbnail(trackToBePushed.thumbnail)
          .addFields(
            {
              name: `Title:`,
              value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
            },
            {
              name: 'Author:',
              value: trackToBePushed.author,
              inline: true,
            },
            {
              name: 'Duration:',
              value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
              inline: true,
            }
          );
    
          message.author.send({ embeds: [e] });
          return;
        } 
      } else {
        await playlistSchema.findOneAndUpdate(
          {
            userId: message.author.id,
          },
          {
            userId: message.author.id,
            $push: {
              tracks: trackToBePushed,
            }
          },
          {
            upsert: true,
          }
        );
  
        const e = new Discord.MessageEmbed()
        .setTitle(`Song #${trackToBePushed.number}`)
        .setColor('WHITE')
        .setThumbnail(trackToBePushed.thumbnail)
        .addFields(
          {
            name: `Title:`,
            value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
          },
          {
            name: 'Author:',
            value: trackToBePushed.author,
            inline: true,
          },
          {
            name: 'Duration:',
            value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
            inline: true,
          }
        );
  
        message.author.send({ embeds: [e] });
        return;
      }
    };

    const track = player.queue.current;

    if (!track) return message.reply(`There are no songs currently playing!`);

    const trackToBePushed = {
      number: numbers.tracks.length + 1,
      title: track.title,
      uri: track.uri,
      author: track.author,
      duration: track.duration,
      thumbnail: track.thumbnail,
    };

    const findAlreadyAdded = await playlistSchema.findOne({ userId: message.author.id });

    if (findAlreadyAdded) {
      if (findAlreadyAdded.tracks.length) {
        const filteredTrack = findAlreadyAdded.tracks.filter(track => {
          return track.uri === trackToBePushed.uri && track.title === trackToBePushed.title;
        });

        if (filteredTrack.length) {
          const alreadyAddedEmbed = new Discord.MessageEmbed()
          .setColor(`WHITE`)
          .setTitle('Already added')
          .setDescription(`[${trackToBePushed.title}](${trackToBePushed.uri})had been added to your playlist before! Do you wanna add anyway?`)

          const row = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
            .setCustomId('yes')
            .setLabel('YES')
            .setStyle('SUCCESS'),
            new Discord.MessageButton()
            .setCustomId('no')
            .setLabel('NO')
            .setStyle('DANGER')
          );

          await message.reply({
            embeds: [alreadyAddedEmbed],
            components: [row]
          }).then(async () => {
            const filter = interaction => {
              return ['yes', 'no'].includes(interaction.customId) && interaction.user.id === message.author.id;
            };

            const collector = message.channel.createMessageComponentCollector({
              filter,
              max: 1,
            });

            collector.on('end', async interaction => {
              await interaction.first().deferUpdate();
              const id = interaction.first().customId;

              if (id === 'yes') {
                await playlistSchema.findOneAndUpdate(
                  {
                    userId: message.author.id,
                  },
                  {
                    userId: message.author.id,
                    $push: {
                      tracks: trackToBePushed,
                    }
                  },
                  {
                    upsert: true,
                  }
                );

                const addedEmbed = new Discord.MessageEmbed()
                .setDescription(`[${trackToBePushed.title}](${trackToBePushed.uri})has been added to your playlist!`)
                .setColor('WHITE')

                await interaction.first().editReply({
                  embeds: [addedEmbed],
                  components: [],
                });

                const e = new Discord.MessageEmbed()
                .setTitle(`Song #${trackToBePushed.number}`)
                .setColor('WHITE')
                .setThumbnail(trackToBePushed.thumbnail)
                .addFields(
                  {
                    name: 'Title:',
                    value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
                  },
                  {
                    name: 'Author:',
                    value: trackToBePushed.author,
                    inline: true,
                  },
                  {
                    name: 'Duration:',
                    value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
                    inline: true,
                  }
                );

                return message.author.send({
                  embeds: [e],
                })
              } else if (id === 'no') {
                const notAddedEmbed = new Discord.MessageEmbed()
                .setDescription(`Alright, we got it!`)
                .setColor('WHITE')

                return interaction.first().editReply({
                  embeds: [notAddedEmbed],
                  components: [],
                });
              }
            })
          })
        } else {
          await playlistSchema.findOneAndUpdate(
            {
              userId: message.author.id,
            },
            {
              userId: message.author.id,
              $push: {
                tracks: trackToBePushed,
              }
            },
            {
              upsert: true,
            }
          );
      
          const e = new Discord.MessageEmbed()
          .setTitle(`Song #${trackToBePushed.number}`)
          .setColor('WHITE')
          .setThumbnail(trackToBePushed.thumbnail)
          .addFields(
            {
              name: 'TItle:',
              value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
            },
            {
              name: 'Author:',
              value: trackToBePushed.author,
              inline: true,
            },
            {
              name: 'Duration:',
              value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
              inline: true,
            }
          );
      
          message.author.send({
            embeds: [e],
          });
      
          return;
        }
      } else {
        await playlistSchema.findOneAndUpdate(
          {
            userId: message.author.id,
          },
          {
            userId: message.author.id,
            $push: {
              tracks: trackToBePushed,
            }
          },
          {
            upsert: true,
          }
        );
    
        const e = new Discord.MessageEmbed()
        .setTitle(`Song #${trackToBePushed.number}`)
        .setColor('WHITE')
        .setThumbnail(trackToBePushed.thumbnail)
        .addFields(
          {
            name: 'TItle:',
            value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
          },
          {
            name: 'Author:',
            value: trackToBePushed.author,
            inline: true,
          },
          {
            name: 'Duration:',
            value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
            inline: true,
          }
        );
    
        message.author.send({
          embeds: [e],
        });
    
        return;
      }
    } else {
      await playlistSchema.findOneAndUpdate(
        {
          userId: message.author.id,
        },
        {
          userId: message.author.id,
          $push: {
            tracks: trackToBePushed,
          }
        },
        {
          upsert: true,
        }
      );
  
      const e = new Discord.MessageEmbed()
      .setTitle(`Song #${trackToBePushed.number}`)
      .setColor('WHITE')
      .setThumbnail(trackToBePushed.thumbnail)
      .addFields(
        {
          name: 'TItle:',
          value: `[${trackToBePushed.title}](${trackToBePushed.uri})`,
        },
        {
          name: 'Author:',
          value: trackToBePushed.author,
          inline: true,
        },
        {
          name: 'Duration:',
          value: `\`${moment.duration(trackToBePushed.duration).format('HH:mm:ss')}\``,
          inline: true,
        }
      );
  
      message.author.send({
        embeds: [e],
      });
  
      return;
    }
  }
}