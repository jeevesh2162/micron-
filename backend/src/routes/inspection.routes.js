// backend/src/routes/inspection.routes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { verifyToken, requireRole } = require('../middleware/auth');
const MasterItem = require('../models/MasterItem');
const Inventory = require('../models/Inventory');
const InspectionRequest = require('../models/InspectionRequest');
const { generateRequestId } = require('../utils/requestId');
const { analyzeInspection } = require('../services/ai/providers/geminiProvider');
const { calculatePrediction } = require('../services/ai/aiService');

const router = express.Router();

// Multer config for temporary image storage (5 MB limit)
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, WEBP are allowed.'));
  },
});

/**
 * POST /api/inspections
 * Employee submits an inspection request with image.
 */
router.post('/', verifyToken, upload.single('photo'), async (req, res) => {
  const tempPath = req.file && req.file.path;
  try {
    const { itemId, quantity, defectDescription } = req.body;
    if (!itemId || !quantity || !defectDescription) {
      return res.status(400).json({ success: false, message: 'itemId, quantity, and defectDescription are required.' });
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
    }
    // Load item and inventory
    const masterItem = await MasterItem.findOne({ itemId }).lean();
    if (!masterItem) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    const inventory = await Inventory.findOne({ itemId }).lean();
    if (!inventory) {
      return res.status(500).json({ success: false, message: 'Inventory record missing for this item.' });
    }
    if (qty > inventory.normalQuantity) {
      return res.status(400).json({ success: false, message: `Requested quantity exceeds available normal quantity (${inventory.normalQuantity}).` });
    }
    // Call Gemini provider
    const geminiResult = await analyzeInspection({
      itemId: masterItem.itemId,
      itemType: masterItem.itemType,
      description: masterItem.description,
      defectDescription,
      imagePath: tempPath,
    });
    // Calculate deterministic scores
    const prediction = calculatePrediction(geminiResult);
    // Build inspection request document
    const inspection = new InspectionRequest({
      requestId: generateRequestId(),
      employeeId: req.user.id,
      itemId: masterItem.itemId,
      itemType: masterItem.itemType,
      quantity: qty,
      defectDescription,
      aiStatus: 'COMPLETED',
      requestStatus: 'PENDING_MANAGER_REVIEW',
      aiPrediction: prediction,
    });
    await inspection.save();
    return res.status(201).json({ success: true, data: inspection });
  } catch (error) {
    console.error('POST /api/inspections error:', error);
    // Handle Gemini or other failures
    const inspection = new InspectionRequest({
      requestId: generateRequestId(),
      employeeId: req.user.id,
      itemId: req.body.itemId || null,
      itemType: null,
      quantity: req.body.quantity ? parseInt(req.body.quantity, 10) : null,
      defectDescription: req.body.defectDescription || null,
      aiStatus: 'FAILED',
      requestStatus: 'AI_FAILED',
      aiPrediction: null,
    });
    await inspection.save();
    return res.status(500).json({ success: false, message: 'Inspection processing failed.' });
  } finally {
    // Cleanup temporary image file
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlink(tempPath, (err) => {
        if (err) console.error('Failed to delete temporary image:', err);
      });
    }
  }
});

/**
 * GET /api/inspections/my-requests
 * Returns the logged‑in employee's inspection requests.
 */
router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await InspectionRequest.find({ employeeId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: requests });
  } catch (error) {
    console.error('GET /api/inspections/my-requests error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch requests.' });
  }
});

/**
 * GET /api/inspections
 * Manager view – list pending inspection requests.
 */
router.get('/', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    const requests = await InspectionRequest.find({ requestStatus: 'PENDING_MANAGER_REVIEW' })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data: requests });
  } catch (error) {
    console.error('GET /api/inspections error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch manager requests.' });
  }
});

module.exports = router;
