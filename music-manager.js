const Erela = require('erela.js');
const Spotify = require('erela.js-spotify');

const spotify = new Spotify({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

module.exports = client => {
  const manager = new Erela.Manager({
    nodes: [
      {
        host: '0.0.0.0',
        port: 80,
        password: 'deocopass123'
      }
    ],
    plugins: [
      spotify,
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });

  return manager;
};