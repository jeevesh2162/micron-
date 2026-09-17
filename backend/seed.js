// seed.js - populate dummy MasterItem and Inventory data
const mongoose = require('mongoose');
require('dotenv').config();
const { connectDb } = require('./src/db');
const MasterItem = require('./src/models/MasterItem');
const Inventory = require('./src/models/Inventory');

const dummyItems = [
  {
    itemId: 'PCB001',
    itemType: 'PCB',
    description: 'Main Control PCB v1',
    totalQuantity: 50,
    normalQuantity: 40,
    reusableQuantity: 5,
    scrapQuantity: 5,
  },
  {
    itemId: 'PCB002',
    itemType: 'PCB',
    description: 'Power Supply PCB',
    totalQuantity: 30,
    normalQuantity: 25,
    reusableQuantity: 3,
    scrapQuantity: 2,
  },
  {
    itemId: 'PCB003',
    itemType: 'PCB',
    description: 'Interface PCB with connectors',
    totalQuantity: 70,
    normalQuantity: 60,
    reusableQuantity: 5,
    scrapQuantity: 5,
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
