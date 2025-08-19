const express = require('express');
const router = express.Router();
const rehearsalController = require('../controllers/rehearsalController');
const { authenticate, isCoordinatorOrAdmin } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.get('/', authenticate, rehearsalController.getAllRehearsals);
router.get('/:id', authenticate, rehearsalController.getRehearsalById);
router.post('/', authenticate, isCoordinatorOrAdmin, rehearsalController.createRehearsal);
router.put('/:id', authenticate, isCoordinatorOrAdmin, rehearsalController.updateRehearsal);
router.delete('/:id', authenticate, isCoordinatorOrAdmin, rehearsalController.deleteRehearsal);

// Rotas para gerenciar músicos no ensaio
router.post('/:rehearsalId/musicians/:musicianId', authenticate, isCoordinatorOrAdmin, rehearsalController.addMusicianToRehearsal);
router.delete('/:rehearsalId/musicians/:musicianId', authenticate, isCoordinatorOrAdmin, rehearsalController.removeMusicianFromRehearsal);
router.put('/:rehearsalId/musicians/:musicianId/confirm', authenticate, rehearsalController.confirmMusician);

// Rota para obter ensaios por data
router.get('/date/:date', authenticate, rehearsalController.getRehearsalsByDate);

module.exports = router;