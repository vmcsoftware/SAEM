const Rehearsal = require('../models/Rehearsal');
const Musician = require('../models/Musician');

/**
 * Obtém todos os ensaios
 */
const getAllRehearsals = async (req, res) => {
  try {
    const rehearsals = await Rehearsal.find()
      .populate('musicians.musician', 'name instrument')
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    
    res.status(200).json({ rehearsals });
  } catch (error) {
    console.error('Erro ao buscar ensaios:', error);
    res.status(500).json({ message: 'Erro ao buscar ensaios', error: error.message });
  }
};

/**
 * Obtém um ensaio pelo ID
 */
const getRehearsalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rehearsal = await Rehearsal.findById(id)
      .populate('musicians.musician')
      .populate('createdBy', 'name email');
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    res.status(200).json({ rehearsal });
  } catch (error) {
    console.error('Erro ao buscar ensaio:', error);
    res.status(500).json({ message: 'Erro ao buscar ensaio', error: error.message });
  }
};

/**
 * Cria um novo ensaio
 */
const createRehearsal = async (req, res) => {
  try {
    const { title, date, startTime, endTime, location, description, repertoire, musicians } = req.body;
    
    // Obter o ID do usuário atual a partir do token JWT
    const createdBy = req.user.userId;
    
    const rehearsal = new Rehearsal({
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      repertoire: repertoire || [],
      musicians: musicians || [],
      createdBy
    });
    
    await rehearsal.save();
    
    res.status(201).json({
      message: 'Ensaio criado com sucesso',
      rehearsal
    });
  } catch (error) {
    console.error('Erro ao criar ensaio:', error);
    res.status(500).json({ message: 'Erro ao criar ensaio', error: error.message });
  }
};

/**
 * Atualiza um ensaio existente
 */
const updateRehearsal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, startTime, endTime, location, description, repertoire } = req.body;
    
    const rehearsal = await Rehearsal.findById(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Atualizar campos
    if (title) rehearsal.title = title;
    if (date) rehearsal.date = date;
    if (startTime) rehearsal.startTime = startTime;
    if (endTime) rehearsal.endTime = endTime;
    if (location) rehearsal.location = location;
    if (description !== undefined) rehearsal.description = description;
    if (repertoire) rehearsal.repertoire = repertoire;
    
    await rehearsal.save();
    
    res.status(200).json({
      message: 'Ensaio atualizado com sucesso',
      rehearsal
    });
  } catch (error) {
    console.error('Erro ao atualizar ensaio:', error);
    res.status(500).json({ message: 'Erro ao atualizar ensaio', error: error.message });
  }
};

/**
 * Remove um ensaio
 */
const deleteRehearsal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rehearsal = await Rehearsal.findById(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    await Rehearsal.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Ensaio removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover ensaio:', error);
    res.status(500).json({ message: 'Erro ao remover ensaio', error: error.message });
  }
};

/**
 * Adiciona um músico ao ensaio
 */
const addMusicianToRehearsal = async (req, res) => {
  try {
    const { rehearsalId, musicianId } = req.params;
    
    const rehearsal = await Rehearsal.findById(rehearsalId);
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    const musician = await Musician.findById(musicianId);
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Verificar se o músico já está no ensaio
    const musicianExists = rehearsal.musicians.some(
      m => m.musician.toString() === musicianId
    );
    
    if (musicianExists) {
      return res.status(400).json({ message: 'Músico já está neste ensaio' });
    }
    
    // Adicionar músico ao ensaio
    rehearsal.musicians.push({
      musician: musicianId,
      confirmed: false,
      notificationSent: false
    });
    
    await rehearsal.save();
    
    res.status(200).json({
      message: 'Músico adicionado ao ensaio com sucesso',
      rehearsal
    });
  } catch (error) {
    console.error('Erro ao adicionar músico ao ensaio:', error);
    res.status(500).json({ message: 'Erro ao adicionar músico ao ensaio', error: error.message });
  }
};

/**
 * Remove um músico do ensaio
 */
const removeMusicianFromRehearsal = async (req, res) => {
  try {
    const { rehearsalId, musicianId } = req.params;
    
    const rehearsal = await Rehearsal.findById(rehearsalId);
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Verificar se o músico está no ensaio
    const musicianIndex = rehearsal.musicians.findIndex(
      m => m.musician.toString() === musicianId
    );
    
    if (musicianIndex === -1) {
      return res.status(400).json({ message: 'Músico não está neste ensaio' });
    }
    
    // Remover músico do ensaio
    rehearsal.musicians.splice(musicianIndex, 1);
    
    await rehearsal.save();
    
    res.status(200).json({
      message: 'Músico removido do ensaio com sucesso',
      rehearsal
    });
  } catch (error) {
    console.error('Erro ao remover músico do ensaio:', error);
    res.status(500).json({ message: 'Erro ao remover músico do ensaio', error: error.message });
  }
};

/**
 * Confirma a presença de um músico no ensaio
 */
const confirmMusician = async (req, res) => {
  try {
    const { rehearsalId, musicianId } = req.params;
    
    const rehearsal = await Rehearsal.findById(rehearsalId);
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Encontrar o músico no ensaio
    const musicianEntry = rehearsal.musicians.find(
      m => m.musician.toString() === musicianId
    );
    
    if (!musicianEntry) {
      return res.status(400).json({ message: 'Músico não está neste ensaio' });
    }
    
    // Confirmar presença
    musicianEntry.confirmed = true;
    
    await rehearsal.save();
    
    res.status(200).json({
      message: 'Presença do músico confirmada com sucesso',
      rehearsal
    });
  } catch (error) {
    console.error('Erro ao confirmar presença do músico:', error);
    res.status(500).json({ message: 'Erro ao confirmar presença do músico', error: error.message });
  }
};

/**
 * Obtém ensaios por data
 */
const getRehearsalsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    // Criar objeto de data a partir da string (formato: YYYY-MM-DD)
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const rehearsals = await Rehearsal.find({
      date: {
        $gte: searchDate,
        $lt: nextDay
      }
    })
    .populate('musicians.musician', 'name instrument')
    .populate('createdBy', 'name')
    .sort({ startTime: 1 });
    
    res.status(200).json({ rehearsals });
  } catch (error) {
    console.error('Erro ao buscar ensaios por data:', error);
    res.status(500).json({ message: 'Erro ao buscar ensaios por data', error: error.message });
  }
};

module.exports = {
  getAllRehearsals,
  getRehearsalById,
  createRehearsal,
  updateRehearsal,
  deleteRehearsal,
  addMusicianToRehearsal,
  removeMusicianFromRehearsal,
  confirmMusician,
  getRehearsalsByDate
};