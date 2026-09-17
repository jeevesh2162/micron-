// seed.js - populate dummy MasterItem and Inventory data
const mongoose = require('mongoose');
require('dotenv').config();
const { connectDb } = require('./src/db');
const MasterItem = require('./src/models/MasterItem');
const Inventory = require('./src/models/Inventory');

const dummyItems = [
  {
    itemId: 'ITEM001',
    itemType: 'Electronics',
    description: 'Smartphone Model X',
    totalQuantity: 100,
    normalQuantity: 80,
    reusableQuantity: 10,
    scrapQuantity: 10,
  },
  {
    itemId: 'ITEM002',
    itemType: 'Hardware',
    description: 'Standard Screw 5mm',
    totalQuantity: 500,
    normalQuantity: 500,
    reusableQuantity: 0,
    scrapQuantity: 0,
  },
  {
    itemId: 'ITEM003',
    itemType: 'Material',
    description: 'Aluminum Sheet 2mm',
    totalQuantity: 200,
    normalQuantity: 150,
    reusableQuantity: 30,
    scrapQuantity: 20,
  },
];

async function seed() {
  try {
    await connectDb();
    console.log('🔧 Connected to DB, starting seeding...');

    // Clean existing collections (optional, be careful in prod)
    await MasterItem.deleteMany({});
    await Inventory.deleteMany({});

    for (const item of dummyItems) {
      const { itemId, itemType, description, totalQuantity, normalQuantity, reusableQuantity, scrapQuantity } = item;
      await MasterItem.create({ itemId, itemType, description, totalQuantity });
      await Inventory.create({
        itemId,
        normalQuantity,
        reusableQuantity,
        scrapQuantity,
      });
      console.log(`✅ Seeded ${itemId}`);
    }

    console.log('🚀 Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
