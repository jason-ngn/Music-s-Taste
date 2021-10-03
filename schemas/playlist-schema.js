const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
}

const playlistSchema = new mongoose.Schema({
  userId: reqString,
  tracks: {
    type: [Object],
    required: true,
  }
});

module.exports = mongoose.model('playlists', playlistSchema);