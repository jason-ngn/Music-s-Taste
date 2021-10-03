module.exports = {
  commands: 'shuffle',
  callback: async function (message, args, text, client, manager) {
    const { guild } = message;

    const player = manager.players.get(guild.id);

    if (!player) {
      message.reply(`There is no player!`);
      return;
    };

    if (!player.queue.size) {
      message.reply(`There are no songs in the queue!`);
      return;
    };

    message.reply(`Shuffled the queue! 🔁`).then(function() {
      player.queue.shuffle();
    })
  },  
}