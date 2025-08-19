const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicianController');
const { authenticate, isCoordinatorOrAdmin } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.get('/', authenticate, musicianController.getAllMusicians);
router.get('/:id', authenticate, musicianController.getMusicianById);
router.post('/', authenticate, isCoordinatorOrAdmin, musicianController.createMusician);
router.put('/:id', authenticate, isCoordinatorOrAdmin, musicianController.updateMusician);
router.delete('/:id', authenticate, isCoordinatorOrAdmin, musicianController.deleteMusician);

// Rota para obter músicos disponíveis em um dia específico
router.get('/available/:day', authenticate, musicianController.getAvailableMusicians);

module.exports = router;