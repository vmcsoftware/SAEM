const mongoose = require('mongoose');

const musicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  instrument: {
    type: String,
    required: true,
    trim: true
  },
  isOrganist: {
    type: Boolean,
    default: false
  },
  availableDays: {
    sunday: { type: Boolean, default: false },
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false }
  },
  active: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Atualizar a data de atualização antes de salvar
musicianSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Musician = mongoose.model('Musician', musicianSchema);

module.exports = Musician;