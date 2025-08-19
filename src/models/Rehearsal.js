const mongoose = require('mongoose');

const rehearsalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  repertoire: [{
    title: String,
    composer: String,
    notes: String
  }],
  musicians: [{
    musician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Musician'
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    notificationSent: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
rehearsalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Rehearsal = mongoose.model('Rehearsal', rehearsalSchema);

module.exports = Rehearsal;