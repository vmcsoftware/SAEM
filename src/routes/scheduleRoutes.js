const express = require('express');
const router = express.Router();
const rehearsalController = require('../controllers/rehearsalController');
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middlewares/authMiddleware');

// Rota para obter todos os ensaios e eventos por data
router.get('/date/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    
    // Criar objeto de data a partir da string (formato: YYYY-MM-DD)
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Buscar ensaios da data
    const rehearsals = await rehearsalController.getRehearsalsByDate(req, res);
    
    // Buscar eventos da data
    const events = await eventController.getEventsByDate(req, res);
    
    // Combinar resultados
    res.status(200).json({
      date,
      rehearsals,
      events
    });
  } catch (error) {
    console.error('Erro ao buscar agenda por data:', error);
    res.status(500).json({ message: 'Erro ao buscar agenda por data', error: error.message });
  }
});

module.exports = router;