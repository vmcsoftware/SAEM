const Event = require('../models/firebase/Event');
const Musician = require('../models/firebase/Musician');

/**
 * Obtém todos os eventos
 */
const getAllEvents = async (req, res) => {
  try {
    // Buscar todos os eventos
    const events = await Event.findAll();
    
    // Ordenar por data
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
  }
};

/**
 * Obtém um evento pelo ID
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    res.status(200).json({ event });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ message: 'Erro ao buscar evento', error: error.message });
  }
};

/**
 * Cria um novo evento
 */
const createEvent = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, eventType, repertoire, musicians } = req.body;
    
    // Obter o ID do usuário atual a partir do token JWT
    const createdBy = req.user.userId;
    
    const eventData = {
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      eventType: eventType || 'outro',
      repertoire: repertoire || [],
      musicians: musicians || [],
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const event = await Event.create(eventData);
    
    res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: 'Erro ao criar evento', error: error.message });
  }
};

/**
 * Atualiza um evento existente
 */
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, startTime, endTime, location, description, eventType, repertoire } = req.body;
    
    // Verificar se o evento existe
    const existingEvent = await Event.findById(id);
    
    if (!existingEvent) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Preparar dados para atualização
    const updateData = {};
    if (title) updateData.title = title;
    if (date) updateData.date = date;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (location) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (eventType) updateData.eventType = eventType;
    if (repertoire) updateData.repertoire = repertoire;
    
    // Atualizar evento
    const event = await Event.update(id, updateData);
    
    res.status(200).json({
      message: 'Evento atualizado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro ao atualizar evento', error: error.message });
  }
};

/**
 * Remove um evento
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o evento existe
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Remover evento
    await Event.delete(id);
    
    res.status(200).json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    res.status(500).json({ message: 'Erro ao remover evento', error: error.message });
  }
};

/**
 * Adiciona um músico ao evento
 */
const addMusicianToEvent = async (req, res) => {
  try {
    const { eventId, musicianId } = req.params;
    
    // Adicionar músico ao evento
    const updatedEvent = await Event.addMusician(eventId, musicianId);
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento não encontrado ou músico já está no evento' });
    }
    
    res.status(200).json({
      message: 'Músico adicionado ao evento com sucesso',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao adicionar músico ao evento:', error);
    res.status(500).json({ message: 'Erro ao adicionar músico ao evento', error: error.message });
  }
};

/**
 * Remove um músico do evento
 */
const removeMusicianFromEvent = async (req, res) => {
  try {
    const { eventId, musicianId } = req.params;
    
    // Remover músico do evento usando o método da classe Event
    const updatedEvent = await Event.removeMusician(eventId, musicianId);
    
    res.status(200).json({
      message: 'Músico removido do evento com sucesso',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao remover músico do evento:', error);
    res.status(500).json({ message: 'Erro ao remover músico do evento', error: error.message });
  }
};

/**
 * Confirma a presença de um músico no evento
 */
const confirmMusician = async (req, res) => {
  try {
    const { eventId, musicianId } = req.params;
    const { confirmed } = req.body;
    
    // Confirmar presença do músico usando o método da classe Event
    const updatedEvent = await Event.confirmMusicianPresence(eventId, musicianId, confirmed);
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento não encontrado ou músico não está no evento' });
    }
    
    res.status(200).json({
      message: `Presença ${confirmed ? 'confirmada' : 'recusada'} com sucesso`,
      event: updatedEvent
    });
  } catch (error) {
    console.error('Erro ao confirmar presença do músico:', error);
    res.status(500).json({ message: 'Erro ao confirmar presença do músico', error: error.message });
  }
};

/**
 * Obtém eventos por data
 */
const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Buscar eventos pela data
    const events = await Event.findByDate(date);
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos por data:', error);
    res.status(500).json({ message: 'Erro ao buscar eventos por data', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addMusicianToEvent,
  removeMusicianFromEvent,
  confirmMusician,
  getEventsByDate
};