require('dotenv').config();
const Discord = require('discord.js');
const Erela = require('erela.js');
const mongoPath = process.env.MONGO_URI
let totalMembers = 0;
let totalServers = 0;
const commandHandler = require('./handlers/command-handler');
const mongoose = require('mongoose');
const {
  putBotInfo
} = require('./utils/api');

const loadLoaders = require('./loaders/load-loaders');

const client = new Discord.Client({
  intents: [
    'GUILDS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_INVITES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_PRESENCES',
    'GUILD_VOICE_STATES',
  ],
});

client.manager = require('./music-manager')(client);
client.watchTogether = require('./together-manager')(client);

client.owners = [
  '754982406393430098',
  '403925308320907276',
];

client.on('ready', async () => {
  for (const guild of client.guilds.cache) {
    totalMembers += guild[1].memberCount;
    totalServers += 1;
  };

  console.log(`${client.user.tag} has logged in!`);
  console.log(`Listening to ${totalMembers.toLocaleString()} user(s), ${totalServers.toLocaleString()} server(s)!`);
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  }).then(() => console.log(`Successfully connected to Mongo DB!`))
  .catch(err => {
    throw err;
  });

  client.manager.init(client.user.id);

  commandHandler.loadPrefix(client);

  loadLoaders(client, client.manager);

  await putBotInfo(client).catch(err => {
    console.log(err);
  })
});

client.login(process.env.TOKEN);
