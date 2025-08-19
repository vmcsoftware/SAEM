const express = require('express');
const router = express.Router();
const Musician = require('../models/Musician');
const Rehearsal = require('../models/Rehearsal');
const Event = require('../models/Event');
const { authenticate } = require('../middlewares/authMiddleware');

// Rota para obter contagens para o dashboard
router.get('/counts', authenticate, async (req, res) => {
  try {
    // Contar músicos, ensaios e eventos
    const musicianCount = await Musician.countDocuments();
    const activeMusicianCount = await Musician.countDocuments({ active: true });
    const rehearsalCount = await Rehearsal.countDocuments();
    const eventCount = await Event.countDocuments();

    res.json({
      musicians: musicianCount,
      activeMusicians: activeMusicianCount,
      rehearsals: rehearsalCount,
      events: eventCount
    });
  } catch (error) {
    console.error('Erro ao obter contagens do dashboard:', error);
    res.status(500).json({ message: 'Erro ao obter contagens do dashboard' });
  }
});

// Rota para obter próximos ensaios e eventos
router.get('/upcoming', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Buscar próximos ensaios (próximos 7 dias)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const rehearsals = await Rehearsal.find({
      date: { $gte: today, $lte: nextWeek }
    }).sort({ date: 1, startTime: 1 }).limit(5);

    // Buscar próximos eventos (próximos 30 dias)
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    const events = await Event.find({
      date: { $gte: today, $lte: nextMonth }
    }).sort({ date: 1, startTime: 1 }).limit(5);

    res.json({ rehearsals, events });
  } catch (error) {
    console.error('Erro ao obter próximos eventos:', error);
    res.status(500).json({ message: 'Erro ao obter próximos eventos' });
  }
});

module.exports = router;