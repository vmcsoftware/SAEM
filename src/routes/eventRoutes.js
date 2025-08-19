const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, isCoordinatorOrAdmin } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.get('/', authenticate, eventController.getAllEvents);
router.get('/:id', authenticate, eventController.getEventById);
router.post('/', authenticate, isCoordinatorOrAdmin, eventController.createEvent);
router.put('/:id', authenticate, isCoordinatorOrAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, isCoordinatorOrAdmin, eventController.deleteEvent);

// Rotas para gerenciar músicos no evento
router.post('/:eventId/musicians/:musicianId', authenticate, isCoordinatorOrAdmin, eventController.addMusicianToEvent);
router.delete('/:eventId/musicians/:musicianId', authenticate, isCoordinatorOrAdmin, eventController.removeMusicianFromEvent);
router.put('/:eventId/musicians/:musicianId/confirm', authenticate, eventController.confirmMusician);

// Rota para obter eventos por data
router.get('/date/:date', authenticate, eventController.getEventsByDate);

module.exports = router;