const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const { authenticate, isAdmin, isCoordinatorOrAdmin } = require('../middlewares/authMiddleware');

// Rota para obter o status da conexão do WhatsApp
router.get('/status', authenticate, async (req, res) => {
  try {
    const status = whatsappService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Erro ao obter status do WhatsApp:', error);
    res.status(500).json({ message: 'Erro ao obter status do WhatsApp' });
  }
});

// Rota para enviar mensagem de teste
router.post('/test', authenticate, isCoordinatorOrAdmin, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Número de telefone é obrigatório' });
    }
    
    // Verificar o status da conexão
    const status = whatsappService.getStatus();
    if (!status.connected) {
      return res.status(400).json({ message: 'WhatsApp não está conectado', status });
    }
    
    // Enviar mensagem de teste usando a função específica
    const result = await whatsappService.sendTestMessage(phone);
    
    if (result) {
      res.json({ success: true, message: 'Mensagem de teste enviada com sucesso' });
    } else {
      res.status(500).json({ success: false, message: 'Falha ao enviar mensagem de teste' });
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem de teste' });
  }
});


// Rota para reconectar o WhatsApp
router.post('/reconnect', authenticate, isAdmin, async (req, res) => {
  try {
    // Usar a função de reconexão específica
    const result = await whatsappService.reconnect();
    
    if (result) {
      res.json({ success: true, message: 'WhatsApp reconectado com sucesso' });
    } else {
      res.status(500).json({ success: false, message: 'Falha ao reconectar o WhatsApp' });
    }
  } catch (error) {
    console.error('Erro ao reconectar WhatsApp:', error);
    res.status(500).json({ message: 'Erro ao reconectar WhatsApp' });
  }
});


// Rota para enviar notificações manualmente para um ensaio
router.post('/rehearsals/:id/notify', authenticate, isCoordinatorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await whatsappService.sendRehearsalNotifications(id);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar notificações para ensaio:', error);
    res.status(500).json({ message: 'Erro ao enviar notificações para ensaio' });
  }
});

// Rota para enviar notificações manualmente para um evento
router.post('/events/:id/notify', authenticate, isCoordinatorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await whatsappService.sendEventNotifications(id);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar notificações para evento:', error);
    res.status(500).json({ message: 'Erro ao enviar notificações para evento' });
  }
});

module.exports = router;