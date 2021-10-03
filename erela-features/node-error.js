module.exports = (client, manager) => {
  manager.on('nodeError', (node, error) => {
    console.log(`Node ${node.options.identifier} had an error: ${error.message}`);
  })
}