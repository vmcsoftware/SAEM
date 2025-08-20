require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const whatsappService = require('./services/whatsappService');

// Inicializar Firebase
require('./config/firebaseConfig');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const musicianRoutes = require('./routes/musicianRoutes');
const rehearsalRoutes = require('./routes/rehearsalRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Inicialização do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Firebase já está inicializado no arquivo de configuração
console.log('Firebase inicializado');

// Inicializar o serviço do WhatsApp
whatsappService.initialize();

// Configurar tarefas agendadas para envio de mensagens
cron.schedule('0 6 * * *', async () => {
  // Enviar mensagens diárias às 6h da manhã
  try {
    await whatsappService.sendDailyMessages();
    console.log('Mensagens diárias enviadas com sucesso');
  } catch (error) {
    console.error('Erro ao enviar mensagens diárias:', error);
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/rehearsals', rehearsalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Rota para a página inicial
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});