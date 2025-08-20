const Musician = require('../models/firebase/Musician');

/**
 * Obtém todos os músicos
 */
const getAllMusicians = async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    // Ordenar por nome
    musicians.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json({ musicians });
  } catch (error) {
    console.error('Erro ao buscar músicos:', error);
    res.status(500).json({ message: 'Erro ao buscar músicos', error: error.message });
  }
};

/**
 * Obtém um músico pelo ID
 */
const getMusicianById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const musician = await Musician.findById(id);
    
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    res.status(200).json({ musician });
  } catch (error) {
    console.error('Erro ao buscar músico:', error);
    res.status(500).json({ message: 'Erro ao buscar músico', error: error.message });
  }
};

/**
 * Cria um novo músico
 */
const createMusician = async (req, res) => {
  try {
    const { name, phone, instrument, isOrganist, availableDays, notes, user } = req.body;
    
    const musicianData = {
      name,
      phone,
      instrument,
      isOrganist: isOrganist || false,
      availableDays: availableDays || {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
      },
      notes,
      user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const musician = await Musician.create(musicianData);
    
    res.status(201).json({
      message: 'Músico criado com sucesso',
      musician
    });
  } catch (error) {
    console.error('Erro ao criar músico:', error);
    res.status(500).json({ message: 'Erro ao criar músico', error: error.message });
  }
};

/**
 * Atualiza um músico existente
 */
const updateMusician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, instrument, isOrganist, availableDays, active, notes, user } = req.body;
    
    // Verificar se o músico existe
    const existingMusician = await Musician.findById(id);
    
    if (!existingMusician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Preparar dados para atualização
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (instrument) updateData.instrument = instrument;
    if (isOrganist !== undefined) updateData.isOrganist = isOrganist;
    if (availableDays) updateData.availableDays = availableDays;
    if (active !== undefined) updateData.active = active;
    if (notes !== undefined) updateData.notes = notes;
    if (user) updateData.user = user;
    
    // Atualizar músico
    const musician = await Musician.update(id, updateData);
    
    res.status(200).json({
      message: 'Músico atualizado com sucesso',
      musician
    });
  } catch (error) {
    console.error('Erro ao atualizar músico:', error);
    res.status(500).json({ message: 'Erro ao atualizar músico', error: error.message });
  }
};

/**
 * Remove um músico
 */
const deleteMusician = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o músico existe
    const musician = await Musician.findById(id);
    
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Remover músico
    await Musician.delete(id);
    
    res.status(200).json({ message: 'Músico removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover músico:', error);
    res.status(500).json({ message: 'Erro ao remover músico', error: error.message });
  }
};

/**
 * Obtém músicos disponíveis em um dia específico
 */
const getAvailableMusicians = async (req, res) => {
  try {
    const { day } = req.params; // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    // Buscar músicos disponíveis no dia especificado
    const musicians = await Musician.findAvailableByDay(parseInt(day));
    
    // Ordenar por nome
    musicians.sort((a, b) => a.name.localeCompare(b.name));
    
    res.status(200).json({ musicians });
  } catch (error) {
    console.error('Erro ao buscar músicos disponíveis:', error);
    res.status(500).json({ message: 'Erro ao buscar músicos disponíveis', error: error.message });
  }
};

module.exports = {
  getAllMusicians,
  getMusicianById,
  createMusician,
  updateMusician,
  deleteMusician,
  getAvailableMusicians
};