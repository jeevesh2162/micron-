const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    trim: true,
  },
  requestId: {
    type: String,
    required: true,
    trim: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceStatus: {
    type: String,
    required: true,
    enum: ['NORMAL', 'REUSABLE', 'SCRAP'],
  },
  destinationStatus: {
    type: String,
    required: true,
    enum: ['NORMAL', 'REUSABLE', 'SCRAP'],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'quantity must be >= 1'],
  },
  previousInventory: {
    normalQuantity: { type: Number, default: 0 },
    reusableQuantity: { type: Number, default: 0 },
    scrapQuantity: { type: Number, default: 0 },
  },
  newInventory: {
    normalQuantity: { type: Number, default: 0 },
    reusableQuantity: { type: Number, default: 0 },
    scrapQuantity: { type: Number, default: 0 },
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // only createdAt needed per spec
});

// Indexes for efficient queries
InventoryLogSchema.index({ itemId: 1 });
InventoryLogSchema.index({ requestId: 1 });
InventoryLogSchema.index({ changedBy: 1 });
InventoryLogSchema.index({ createdAt: 1 });

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
