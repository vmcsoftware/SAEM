const Musician = require('../models/Musician');

/**
 * Obtém todos os músicos
 */
const getAllMusicians = async (req, res) => {
  try {
    const musicians = await Musician.find().sort({ name: 1 });
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
    
    const musician = new Musician({
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
      user
    });
    
    await musician.save();
    
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
    
    const musician = await Musician.findById(id);
    
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    // Atualizar campos
    if (name) musician.name = name;
    if (phone) musician.phone = phone;
    if (instrument) musician.instrument = instrument;
    if (isOrganist !== undefined) musician.isOrganist = isOrganist;
    if (availableDays) musician.availableDays = availableDays;
    if (active !== undefined) musician.active = active;
    if (notes !== undefined) musician.notes = notes;
    if (user) musician.user = user;
    
    await musician.save();
    
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
    
    const musician = await Musician.findById(id);
    
    if (!musician) {
      return res.status(404).json({ message: 'Músico não encontrado' });
    }
    
    await Musician.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Músico removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover músico:', error);
    res.status(500).json({ message: 'Erro ao remover músico', error: error.message });
  }
};

/**
 * Obtém músicos disponíveis em um determinado dia da semana
 */
const getAvailableMusicians = async (req, res) => {
  try {
    const { day } = req.params;
    
    // Validar o dia da semana
    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: 'Dia da semana inválido' });
    }
    
    // Buscar músicos disponíveis no dia especificado
    const musicians = await Musician.find({
      [`availableDays.${day}`]: true,
      active: true
    }).sort({ name: 1 });
    
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