const Rehearsal = require('../models/firebase/Rehearsal');
const Musician = require('../models/firebase/Musician');

/**
 * Obtém todos os ensaios
 */
const getAllRehearsals = async (req, res) => {
  try {
    // Buscar todos os ensaios
    const rehearsals = await Rehearsal.findAll();
    
    // Ordenar por data
    rehearsals.sort((a, b) => new Date(a.date) - new Date(b.date));
    
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
    
    const rehearsal = await Rehearsal.findById(id);
    
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
    
    const rehearsalData = {
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      repertoire: repertoire || [],
      musicians: musicians || [],
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const rehearsal = await Rehearsal.create(rehearsalData);
    
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
    
    // Verificar se o ensaio existe
    const existingRehearsal = await Rehearsal.findById(id);
    
    if (!existingRehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Preparar dados para atualização
    const updateData = {};
    if (title) updateData.title = title;
    if (date) updateData.date = date;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (location) updateData.location = location;
    if (description !== undefined) updateData.description = description;
    if (repertoire) updateData.repertoire = repertoire;
    
    // Atualizar ensaio
    const rehearsal = await Rehearsal.update(id, updateData);
    
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
    
    // Verificar se o ensaio existe
    const rehearsal = await Rehearsal.findById(id);
    
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Remover ensaio
    await Rehearsal.delete(id);
    
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
    
    // Verificar se o ensaio existe
    const rehearsal = await Rehearsal.findById(rehearsalId);
    if (!rehearsal) {
      return res.status(404).json({ message: 'Ensaio não encontrado' });
    }
    
    // Verificar se o músico existe
    const musician = await Musician.findById(musicianId);
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Adicionar músico ao ensaio usando o método da classe Rehearsal
    const updatedRehearsal = await Rehearsal.addMusician(rehearsalId, musicianId);
    
    res.status(200).json({
      message: 'Músico adicionado ao ensaio com sucesso',
      rehearsal: updatedRehearsal
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
    
    // Remover músico do ensaio usando o método da classe Rehearsal
    const updatedRehearsal = await Rehearsal.removeMusician(rehearsalId, musicianId);
    
    res.status(200).json({
      message: 'Músico removido do ensaio com sucesso',
      rehearsal: updatedRehearsal
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
    const { confirmed } = req.body;
    
    // Confirmar presença do músico usando o método da classe Rehearsal
    const updatedRehearsal = await Rehearsal.confirmMusicianPresence(rehearsalId, musicianId, confirmed);
    
    res.status(200).json({
      message: `Presença ${confirmed ? 'confirmada' : 'recusada'} com sucesso`,
      rehearsal: updatedRehearsal
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
    
    // Buscar ensaios pela data usando o método do Firebase
    const rehearsals = await Rehearsal.findByDate(searchDate, nextDay);
    
    // Ordenar por horário de início
    rehearsals.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
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