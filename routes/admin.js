const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');

// Admin Panel
router.get('/', (req, res) => {
    res.render('pages/admin', { title: 'Admin Panel' });
});

// Add New Anime
router.post('/add', async (req, res) => {
    const newAnime = new Anime(req.body);
    await newAnime.save();
    res.redirect('/admin');
});

// Delete Anime
router.delete('/:id', async (req, res) => {
    await Anime.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;
