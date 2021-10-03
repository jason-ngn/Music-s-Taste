const validPermissions = require('../utils/permissions');
const guildPrefix = {};
const globalPrefix = process.env.PREFIX;
const perServerPrefixSchema = require('../schemas/per-server-prefix');

function validatePermissions(permissions) {
  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node: ${permission}`);
    }
  }
}

let recentlyRan = [];

const allCommands = {};

module.exports = async (commandOptions) => {
  let {
    commands,
    permissions = [],
    clientPermissions = [],
  } = commandOptions;

  if (typeof commands === 'string') {
    commands = [commands];
  };

  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions];
    }

    validatePermissions(permissions);
  };

  if (clientPermissions.length) {
    if (typeof clientPermissions === 'string') {
      clientPermissions = [clientPermissions];
    };

    validatePermissions(clientPermissions);
  };

  for (const command of commands) {
    allCommands[command] = {
      ...commandOptions,
      commands,
      permissions,
      clientPermissions,
    }
  }
};

module.exports.listen = async client => {
  client.on('messageCreate', async message => {
    const { member, content, guild, channel } = message;

    const args = content.split(/[ ]+/);

    const name = args.shift().toLowerCase();

    const prefix = guildPrefix[guild.id] || globalPrefix;

    if (name.startsWith(prefix)) {
      const command = allCommands[name.replace(prefix, '')];
      if (!command) return;

      const {
        permissions,
        permissionError = 'You do not have enough permissions to use this command!',
        minArgs = 0,
        maxArgs = null,
        expectedArgs = '',
        callback,
        ownerOnly,
        clientPermissions,
        cooldown,
        commands,
      } = command;

      if (ownerOnly === true) {
        if (!client.owners.includes(member.user.id)) {
          message.reply(`This command is for owners only!`);
          return;
        };
      };

      for (const permission of permissions) {
        if (!member.permissions.has(permission)) {
          message.reply(permissionError);
          return;
        }
      };

      for (const permission of clientPermissions) {
        if (!guild.me.permissions.has(permission)) {
          message.reply(`I don't have the required permissions to execute this command!`);
          return;
        }
      };

      if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
        message.reply(`Incorrect syntax! Please use: \`${prefix}${commands[0]} ${expectedArgs}\``);
        return;
      };

      let cooldownString = `${guild.id}-${member.id}-${commands[0]}`;

      if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
        message.reply(`Woah woah chill! You can't use that command so soon!`);
        return;
      };

      if (cooldown > 0) {
        recentlyRan.push(cooldownString);
        setTimeout(() => {
          recentlyRan = recentlyRan.filter(string => {
            return string !== cooldownString;
          });
        }, 1000 * cooldown);
      }

      callback(message, args, args.join(' '), client, client.manager);
    };
  });
}

module.exports.updatePrefixCache = async (guild, prefix) => {
  await perServerPrefixSchema.findOneAndUpdate({
    guildId: guild.id,
  }, {
    guildId: guild.id,
    prefix,
  }, {
    upsert: true,
  });

  guildPrefix[guild.id] = prefix;
};

module.exports.loadPrefix = async client => {
  for (const guild of client.guilds.cache) {
    const guildId = guild[1].id;

    const result = await perServerPrefixSchema.findOne({ guildId });
    guildPrefix[guildId] = result ? result.prefix : globalPrefix;
  };

  console.log(`Loading prefix for ${client.guilds.cache.size} server(s)!`);
};

module.exports.getPrefix = async (guild) => {
  return guildPrefix[guild.id];
};
