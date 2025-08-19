const Event = require('../models/Event');
const Musician = require('../models/Musician');

/**
 * Obtém todos os eventos
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('musicians.musician', 'name instrument')
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    
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
    
    const event = await Event.findById(id)
      .populate('musicians.musician')
      .populate('createdBy', 'name email');
    
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
    
    const event = new Event({
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      eventType: eventType || 'outro',
      repertoire: repertoire || [],
      musicians: musicians || [],
      createdBy
    });
    
    await event.save();
    
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
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Atualizar campos
    if (title) event.title = title;
    if (date) event.date = date;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (location) event.location = location;
    if (description !== undefined) event.description = description;
    if (eventType) event.eventType = eventType;
    if (repertoire) event.repertoire = repertoire;
    
    await event.save();
    
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
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    await Event.findByIdAndDelete(id);
    
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
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    const musician = await Musician.findById(musicianId);
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Verificar se o músico já está no evento
    const musicianExists = event.musicians.some(
      m => m.musician.toString() === musicianId
    );
    
    if (musicianExists) {
      return res.status(400).json({ message: 'Músico já está neste evento' });
    }
    
    // Adicionar músico ao evento
    event.musicians.push({
      musician: musicianId,
      confirmed: false,
      notificationSent: false
    });
    
    await event.save();
    
    res.status(200).json({
      message: 'Músico adicionado ao evento com sucesso',
      event
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
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Verificar se o músico está no evento
    const musicianIndex = event.musicians.findIndex(
      m => m.musician.toString() === musicianId
    );
    
    if (musicianIndex === -1) {
      return res.status(400).json({ message: 'Músico não está neste evento' });
    }
    
    // Remover músico do evento
    event.musicians.splice(musicianIndex, 1);
    
    await event.save();
    
    res.status(200).json({
      message: 'Músico removido do evento com sucesso',
      event
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
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Encontrar o músico no evento
    const musicianEntry = event.musicians.find(
      m => m.musician.toString() === musicianId
    );
    
    if (!musicianEntry) {
      return res.status(400).json({ message: 'Músico não está neste evento' });
    }
    
    // Confirmar presença
    musicianEntry.confirmed = true;
    
    await event.save();
    
    res.status(200).json({
      message: 'Presença do músico confirmada com sucesso',
      event
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
    
    // Criar objeto de data a partir da string (formato: YYYY-MM-DD)
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const events = await Event.find({
      date: {
        $gte: searchDate,
        $lt: nextDay
      }
    })
    .populate('musicians.musician', 'name instrument')
    .populate('createdBy', 'name')
    .sort({ startTime: 1 });
    
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