const mongoose = require('mongoose');

const InspectionRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: String,
    required: true,
    trim: true,
  },
  itemType: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'quantity must be >= 1'],
  },
  defectDescription: {
    type: String,
    required: true,
  },
  aiStatus: {
    type: String,
    required: true,
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
  },
  aiPrediction: {
    damageDetection: {
      result: {
        type: String,
        enum: ['DAMAGED', 'NOT_DAMAGED', 'UNCERTAIN'],
      },
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'UNCERTAIN'],
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      explanation: String,
    },
    materialValidation: {
      result: {
        type: String,
        enum: ['CONSISTENT', 'INCONSISTENT', 'UNCERTAIN'],
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      explanation: String,
    },
    reasonConsistency: {
      result: {
        type: String,
        enum: ['CONSISTENT', 'INCONSISTENT', 'UNCERTAIN'],
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
      explanation: String,
    },
    suggestedStatus: {
      type: String,
      enum: ['NORMAL', 'REUSABLE', 'SCRAP'],
    },
    overallExplanation: String,
  },
  requestStatus: {
    type: String,
    required: true,
    enum: ['PENDING_MANAGER_REVIEW', 'APPROVED', 'REJECTED', 'AI_FAILED'],
  },
  managerDecision: {
    type: String,
  },
  managerComments: {
    type: String,
  },
  finalStatus: {
    type: String,
    enum: ['NORMAL', 'REUSABLE', 'SCRAP'],
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: Date,
}, {
  timestamps: true,
});

// Indexes for performance
InspectionRequestSchema.index({ employeeId: 1 });
InspectionRequestSchema.index({ itemId: 1 });
InspectionRequestSchema.index({ requestStatus: 1 });
InspectionRequestSchema.index({ createdAt: 1 });

module.exports = mongoose.model('InspectionRequest', InspectionRequestSchema);
