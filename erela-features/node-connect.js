module.exports = async (client, manager) => {
  await manager.on('nodeConnect', node => {
    console.log(`Node ${node.options.identifier} connected!`);
  });
};