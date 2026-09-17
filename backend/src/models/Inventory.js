const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  normalQuantity: {
    type: Number,
    required: true,
    min: [0, 'normalQuantity must be >= 0'],
  },
  reusableQuantity: {
    type: Number,
    required: true,
    min: [0, 'reusableQuantity must be >= 0'],
  },
  scrapQuantity: {
    type: Number,
    required: true,
    min: [0, 'scrapQuantity must be >= 0'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', InventorySchema);
