require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const whatsappService = require('./services/whatsappService');

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

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

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