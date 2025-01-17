const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    title: String,
    description: String,
    genre: [String],
    type: String,
    status: String,
    episodes: Number,
    releaseDate: Date,
    poster: String,
    views: { type: Number, default: 0 },
    trending: { type: Boolean, default: false },
});

module.exports = mongoose.model('Anime', animeSchema);
