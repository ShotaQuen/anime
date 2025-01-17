const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');

// Get All Anime
router.get('/', async (req, res) => {
    const animeList = await Anime.find().limit(20);
    res.render('pages/anime-list', { title: 'Anime List', animeList });
});

// Anime Details
router.get('/:id', async (req, res) => {
    const anime = await Anime.findById(req.params.id);
    res.render('pages/anime-detail', { title: anime.title, anime });
});

module.exports = router;
