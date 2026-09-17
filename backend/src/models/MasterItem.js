const mongoose = require('mongoose');

const MasterItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  itemType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: [0, 'totalQuantity must be >= 0'],
  },
}, {
  timestamps: true,
});

// Index on itemType for fast lookup
MasterItemSchema.index({ itemType: 1 });

module.exports = mongoose.model('MasterItem', MasterItemSchema);
