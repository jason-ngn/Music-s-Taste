module.exports = async (client, manager) => {
  client.on('raw', d => manager.updateVoiceState(d));
};