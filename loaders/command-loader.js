const fs = require('fs');
const path = require('path');
const commandHandler = require('../handlers/command-handler');

module.exports = async (client) => {
  const commands = [];

  const readCommands = async dir => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        console.log(`Registering group: ${file}`);
        readCommands(path.join(dir, file));
      } else {
        const command = require(path.join(__dirname, dir, file));
        commands.push(command);
        console.log(`Enabling command: ${file}`);
        commandHandler(command);
      }
    }
  }

  readCommands('../commands');

  commandHandler.listen(client);

  return commands;
}