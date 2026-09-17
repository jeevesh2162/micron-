const express = require('express');
const mongoose = require('mongoose');
const MasterItem = require('../models/MasterItem');
const Inventory = require('../models/Inventory');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Helper: project a MasterItem document to a clean response shape
// ─────────────────────────────────────────────────────────────────────────────
function formatItem(doc) {
  return {
    itemId: doc.itemId,
    itemType: doc.itemType,
    description: doc.description,
    totalQuantity: doc.totalQuantity,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/items
// Access: any authenticated user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await MasterItem.find().sort({ itemId: 1 }).lean();
    return res.json({
      success: true,
      data: items.map(formatItem),
    });
  } catch (error) {
    console.error('GET /api/items error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving items.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/items/:itemId
// Access: any authenticated user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:itemId', verifyToken, async (req, res) => {
  try {
    const item = await MasterItem.findOne({ itemId: req.params.itemId }).lean();
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }
    return res.json({ success: true, data: formatItem(item) });
  } catch (error) {
    console.error('GET /api/items/:itemId error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving item.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/items
// Access: manager only
// Creates a MasterItem + corresponding Inventory atomically where possible.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    const { itemId, itemType, description, totalQuantity } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!itemId || !itemType || !description) {
      return res.status(400).json({
        success: false,
        message: 'itemId, itemType, and description are required.',
      });
    }
    if (totalQuantity === undefined || totalQuantity === null) {
      return res.status(400).json({ success: false, message: 'totalQuantity is required.' });
    }
    if (typeof totalQuantity !== 'number' || isNaN(totalQuantity)) {
      return res.status(400).json({ success: false, message: 'totalQuantity must be a number.' });
    }
    if (totalQuantity < 0) {
      return res.status(400).json({ success: false, message: 'totalQuantity must be >= 0.' });
    }

    const cleanItemId = String(itemId).trim();
    const cleanItemType = String(itemType).trim();
    const cleanDescription = String(description).trim();

    // ── Duplicate check ───────────────────────────────────────────────────────
    const exists = await MasterItem.findOne({ itemId: cleanItemId }).lean();
    if (exists) {
      return res.status(409).json({ success: false, message: 'Item already exists.' });
    }

    // ── Atomic creation (session/transaction when replica set available) ──────
    //
    // Mongoose sessions require a MongoDB replica set.  A standalone dev server
    // does NOT support transactions.  We attempt a session first; if the server
    // does not support it we fall back to a sequential create with compensating
    // cleanup on failure.
    //
    let masterItem;
    let inventory;

    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      masterItem = await MasterItem.create([{
        itemId: cleanItemId,
        itemType: cleanItemType,
        description: cleanDescription,
        totalQuantity,
      }], { session });
      masterItem = masterItem[0];

      inventory = await Inventory.create([{
        itemId: cleanItemId,
        normalQuantity: totalQuantity,
        reusableQuantity: 0,
        scrapQuantity: 0,
      }], { session });
      inventory = inventory[0];

      await session.commitTransaction();
    } catch (txError) {
      if (session) {
        try { await session.abortTransaction(); } catch (_) { /* ignore */ }
      }

      // If the error is a transaction-not-supported error (standalone server)
      // fall back to non-transactional sequential creation with cleanup.
      const isTransactionUnsupported =
        txError.codeName === 'IllegalOperation' ||
        txError.message?.includes('Transaction') ||
        txError.code === 20;

      if (isTransactionUnsupported) {
        console.warn(
          '[item.routes] MongoDB transactions not supported (standalone server). ' +
          'Falling back to sequential creation with compensating cleanup.'
        );
        try {
          masterItem = await MasterItem.create({
            itemId: cleanItemId,
            itemType: cleanItemType,
            description: cleanDescription,
            totalQuantity,
          });
          try {
            inventory = await Inventory.create({
              itemId: cleanItemId,
              normalQuantity: totalQuantity,
              reusableQuantity: 0,
              scrapQuantity: 0,
            });
          } catch (invError) {
            // Rollback MasterItem creation manually
            await MasterItem.deleteOne({ itemId: cleanItemId });
            throw invError;
          }
        } catch (fallbackError) {
          console.error('POST /api/items fallback error:', fallbackError);
          return res.status(500).json({
            success: false,
            message: 'Failed to create item. Please try again.',
          });
        }
      } else {
        console.error('POST /api/items transaction error:', txError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create item due to a server error.',
        });
      }
    } finally {
      if (session) {
        session.endSession();
      }
    }

    return res.status(201).json({
      success: true,
      message: `Item '${cleanItemId}' created successfully.`,
      data: {
        item: formatItem(masterItem),
        inventory: {
          itemId: inventory.itemId,
          normalQuantity: inventory.normalQuantity,
          reusableQuantity: inventory.reusableQuantity,
          scrapQuantity: inventory.scrapQuantity,
        },
      },
    });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating item.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/items/:itemId
// Access: manager only
// Allowed updates: itemType, description, totalQuantity
// Invariant: totalQuantity == normalQty + reusableQty + scrapQty is maintained.
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:itemId', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    const { itemId } = req.params;

    // ── Block disallowed fields ────────────────────────────────────────────────
    const disallowed = ['normalQuantity', 'reusableQuantity', 'scrapQuantity', 'location', 'itemId'];
    const received = Object.keys(req.body);
    const blocked = received.filter((k) => disallowed.includes(k));
    if (blocked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following fields cannot be modified directly: ${blocked.join(', ')}.`,
      });
    }

    // ── Find item ─────────────────────────────────────────────────────────────
    const masterItem = await MasterItem.findOne({ itemId });
    if (!masterItem) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    // ── Build update object ───────────────────────────────────────────────────
    const updates = {};
    if (req.body.itemType !== undefined) {
      updates.itemType = String(req.body.itemType).trim();
    }
    if (req.body.description !== undefined) {
      updates.description = String(req.body.description).trim();
    }

    // ── Handle totalQuantity change ───────────────────────────────────────────
    if (req.body.totalQuantity !== undefined) {
      const newTotal = req.body.totalQuantity;
      if (typeof newTotal !== 'number' || isNaN(newTotal)) {
        return res.status(400).json({ success: false, message: 'totalQuantity must be a number.' });
      }
      if (newTotal < 0) {
        return res.status(400).json({ success: false, message: 'totalQuantity must be >= 0.' });
      }

      // Fetch the current inventory to check invariant
      const inventory = await Inventory.findOne({ itemId });
      if (!inventory) {
        return res.status(500).json({
          success: false,
          message: 'Inventory record for this item is missing. Contact an administrator.',
        });
      }

      const distributed = inventory.normalQuantity + inventory.reusableQuantity + inventory.scrapQuantity;

      if (newTotal < distributed) {
        return res.status(400).json({
          success: false,
          message:
            `Cannot reduce totalQuantity to ${newTotal}. ` +
            `Current distributed quantity is ${distributed} ` +
            `(normal=${inventory.normalQuantity}, ` +
            `reusable=${inventory.reusableQuantity}, ` +
            `scrap=${inventory.scrapQuantity}).`,
        });
      }

      // Increase: additional units go into normalQuantity
      const diff = newTotal - masterItem.totalQuantity;
      if (diff > 0) {
        await Inventory.updateOne(
          { itemId },
          { $inc: { normalQuantity: diff } }
        );
      }
      // Decrease that is still >= distributed is allowed; no inventory bucket changes.
      updates.totalQuantity = newTotal;
    }

    // Apply updates to MasterItem
    Object.assign(masterItem, updates);
    await masterItem.save();

    return res.json({
      success: true,
      message: `Item '${itemId}' updated successfully.`,
      data: formatItem(masterItem),
    });
  } catch (error) {
    console.error('PATCH /api/items/:itemId error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating item.' });
  }
});

module.exports = router;
