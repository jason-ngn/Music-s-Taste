module.exports = async (client, manager) => {
  manager.on('queueEnd', player => {
    const channel = client.channels.cache.get(player.textChannel);

    channel.send('Nothing left to play, I\'m leaving!').then(() => {
      player.destroy();
    });
  })
}