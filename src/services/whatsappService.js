const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Musician = require('../models/Musician');
const Rehearsal = require('../models/Rehearsal');
const Event = require('../models/Event');

let client = null;

/**
 * Inicializa o cliente do WhatsApp
 */
const initialize = async () => {
  try {
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: process.env.WHATSAPP_SESSION_DATA_PATH || './whatsapp-session'
      }),
      puppeteer: {
        args: ['--no-sandbox']
      }
    });

    client.on('qr', (qr) => {
      console.log('QR Code recebido, escaneie-o com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('Cliente WhatsApp está pronto!');
    });

    client.on('authenticated', () => {
      console.log('Autenticado com sucesso no WhatsApp!');
    });

    client.on('auth_failure', (msg) => {
      console.error('Falha na autenticação do WhatsApp:', msg);
    });

    await client.initialize();
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o cliente WhatsApp:', error);
    return false;
  }
};

/**
 * Envia uma mensagem para um número de telefone
 * @param {string} phone - Número de telefone (com código do país)
 * @param {string} message - Mensagem a ser enviada
 */
const sendMessage = async (phone, message) => {
  if (!client) {
    throw new Error('Cliente WhatsApp não inicializado');
  }

  try {
    // Formatar o número de telefone (adicionar 55 se necessário e remover caracteres especiais)
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = `55${formattedPhone}`;
    }
    
    // Garantir que o número está no formato correto para o WhatsApp
    const chatId = `${formattedPhone}@c.us`;
    
    // Enviar a mensagem
    await client.sendMessage(chatId, message);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${phone}:`, error);
    return false;
  }
};

/**
 * Envia mensagens diárias para músicos com base nos ensaios e eventos do dia
 */
const sendDailyMessages = async () => {
  try {
    if (!client) {
      await initialize();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Obter o dia da semana (0 = Domingo, 1 = Segunda, ...)
    const dayOfWeek = today.getDay();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = daysOfWeek[dayOfWeek];
    
    // Buscar ensaios do dia
    const todaysRehearsals = await Rehearsal.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('musicians.musician');
    
    // Buscar eventos do dia
    const todaysEvents = await Event.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('musicians.musician');
    
    // Buscar músicos disponíveis no dia da semana atual
    const availableMusicians = await Musician.find({
      [`availableDays.${dayName}`]: true,
      active: true
    });
    
    // Enviar mensagens para músicos com ensaios hoje
    for (const rehearsal of todaysRehearsals) {
      for (const musicianEntry of rehearsal.musicians) {
        if (!musicianEntry.notificationSent) {
          const musician = musicianEntry.musician;
          if (musician && musician.phone) {
            const message = `Olá ${musician.name}, lembrete: Você tem um ensaio hoje!\n\n*${rehearsal.title}*\nHorário: ${rehearsal.startTime} - ${rehearsal.endTime}\nLocal: ${rehearsal.location}\n${rehearsal.description ? `Descrição: ${rehearsal.description}\n` : ''}\nRepertório:\n${rehearsal.repertoire.map(item => `- ${item.title} (${item.composer || 'N/A'})`).join('\n')}`;
            
            const sent = await sendMessage(musician.phone, message);
            if (sent) {
              musicianEntry.notificationSent = true;
            }
          }
        }
      }
      await rehearsal.save();
    }
    
    // Enviar mensagens para músicos com eventos hoje
    for (const event of todaysEvents) {
      for (const musicianEntry of event.musicians) {
        if (!musicianEntry.notificationSent) {
          const musician = musicianEntry.musician;
          if (musician && musician.phone) {
            const message = `Olá ${musician.name}, lembrete: Você tem um evento hoje!\n\n*${event.title}*\nHorário: ${event.startTime} - ${event.endTime}\nLocal: ${event.location}\n${event.description ? `Descrição: ${event.description}\n` : ''}\nRepertório:\n${event.repertoire.map(item => `- ${item.title} (${item.composer || 'N/A'})`).join('\n')}`;
            
            const sent = await sendMessage(musician.phone, message);
            if (sent) {
              musicianEntry.notificationSent = true;
            }
          }
        }
      }
      await event.save();
    }
    
    // Enviar lembretes para músicos disponíveis no dia (que não têm ensaios ou eventos)
    for (const musician of availableMusicians) {
      // Verificar se o músico já está em algum ensaio ou evento do dia
      const hasRehearsalOrEvent = todaysRehearsals.some(r => 
        r.musicians.some(m => m.musician._id.toString() === musician._id.toString())
      ) || todaysEvents.some(e => 
        e.musicians.some(m => m.musician._id.toString() === musician._id.toString())
      );
      
      // Se não estiver em nenhum ensaio ou evento, enviar lembrete de disponibilidade
      if (!hasRehearsalOrEvent) {
        const message = `Olá ${musician.name}, hoje é seu dia de disponibilidade para ensaios. Não há ensaios ou eventos agendados para você hoje, mas fique atento a possíveis mudanças.`;
        await sendMessage(musician.phone, message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagens diárias:', error);
    return false;
  }
};

/**
 * Verifica o status da conexão do WhatsApp
 */
const getStatus = () => {
  if (!client) {
    return { connected: false, message: 'Cliente WhatsApp não inicializado' };
  }
  
  return { 
    connected: client.info ? true : false,
    message: client.info ? 'Conectado' : 'Inicializado mas não conectado',
    info: client.info || null
  };
};

/**
 * Reconecta o cliente WhatsApp
 */
const reconnect = async () => {
  try {
    if (client) {
      await client.destroy();
    }
    return await initialize();
  } catch (error) {
    console.error('Erro ao reconectar o cliente WhatsApp:', error);
    return false;
  }
};

/**
 * Envia uma mensagem de teste para um número
 */
const sendTestMessage = async (phone) => {
  try {
    const message = 'Esta é uma mensagem de teste do Sistema SAEM. Se você recebeu esta mensagem, a configuração do WhatsApp está funcionando corretamente.';
    return await sendMessage(phone, message);
  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error);
    return false;
  }
};

/**
 * Envia notificações para um ensaio específico
 */
const sendRehearsalNotifications = async (rehearsalId) => {
  try {
    const rehearsal = await Rehearsal.findById(rehearsalId).populate('musicians.musician');
    if (!rehearsal) {
      throw new Error('Ensaio não encontrado');
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const musicianEntry of rehearsal.musicians) {
      const musician = musicianEntry.musician;
      if (musician && musician.phone) {
        const message = `Olá ${musician.name}, você foi escalado para um ensaio!

*${rehearsal.title}*
Data: ${new Date(rehearsal.date).toLocaleDateString('pt-BR')}
Horário: ${rehearsal.startTime} - ${rehearsal.endTime}
Local: ${rehearsal.location}
${rehearsal.description ? `Descrição: ${rehearsal.description}\n` : ''}\nRepertório:\n${rehearsal.repertoire.map(item => `- ${item.title} (${item.composer || 'N/A'})`).join('\n')}\n\nPor favor, confirme sua presença respondendo SIM ou NÃO.`;
        
        const sent = await sendMessage(musician.phone, message);
        if (sent) {
          musicianEntry.notificationSent = true;
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    }
    
    await rehearsal.save();
    return { success: true, successCount, failCount };
  } catch (error) {
    console.error('Erro ao enviar notificações para ensaio:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia notificações para um evento específico
 */
const sendEventNotifications = async (eventId) => {
  try {
    const event = await Event.findById(eventId).populate('musicians.musician');
    if (!event) {
      throw new Error('Evento não encontrado');
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const musicianEntry of event.musicians) {
      const musician = musicianEntry.musician;
      if (musician && musician.phone) {
        const message = `Olá ${musician.name}, você foi escalado para um evento!

*${event.title}*
Data: ${new Date(event.date).toLocaleDateString('pt-BR')}
Horário: ${event.startTime} - ${event.endTime}
Local: ${event.location}
${event.description ? `Descrição: ${event.description}\n` : ''}\nRepertório:\n${event.repertoire.map(item => `- ${item.title} (${item.composer || 'N/A'})`).join('\n')}\n\nPor favor, confirme sua presença respondendo SIM ou NÃO.`;
        
        const sent = await sendMessage(musician.phone, message);
        if (sent) {
          musicianEntry.notificationSent = true;
          successCount++;
        } else {
          failCount++;
        }
      } else {
        failCount++;
      }
    }
    
    await event.save();
    return { success: true, successCount, failCount };
  } catch (error) {
    console.error('Erro ao enviar notificações para evento:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initialize,
  sendMessage,
  sendDailyMessages,
  getStatus,
  reconnect,
  sendTestMessage,
  sendRehearsalNotifications,
  sendEventNotifications
};