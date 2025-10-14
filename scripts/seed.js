#!/usr/bin/env node
/* Seed script for FoodExpress - creates 1 admin, 2 users, 3 restaurants and sample menus
   Usage: node scripts/seed.js
   WARNING: run in dev/test only
*/

// load .env for local dev
require('dotenv').config();
const { connect, close } = require('../src/config/mongodb');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

async function seed() {
  await connect();
  try {
    // wipe first to ensure idempotence in dev
    await Promise.all([User.deleteMany({}), Restaurant.deleteMany({}), Menu.deleteMany({})]);

    // create admin
    const admin = await User.create({
      email: 'admin@example.com',
      username: 'admin',
      password: 'password',
      role: 'admin',
    });

    // create 2 users
    const user1 = await User.create({
      email: 'alice@example.com',
      username: 'alice',
      password: 'password',
    });
    const user2 = await User.create({
      email: 'bob@example.com',
      username: 'bob',
      password: 'password',
    });

    // create 3 restaurants
    const r1 = await Restaurant.create({
      name: 'Chez A',
      address: '1 rue A',
      phone: '+330123456',
      opening_hours: '9-21',
    });
    const r2 = await Restaurant.create({
      name: 'Bistro B',
      address: '2 avenue B',
      phone: '+330987654',
      opening_hours: '10-22',
    });
    const r3 = await Restaurant.create({
      name: 'Cafe C',
      address: '3 boulevard C',
      phone: '+330555000',
      opening_hours: '8-20',
    });

    // create menus
    await Menu.create({
      restaurant_id: r1._id,
      name: 'Salade',
      description: 'Fresh salad',
      price: 6.5,
      category: 'starter',
    });
    await Menu.create({
      restaurant_id: r1._id,
      name: 'Steak',
      description: 'Grilled steak',
      price: 14.5,
      category: 'main',
    });

    await Menu.create({
      restaurant_id: r2._id,
      name: 'Pizza',
      description: 'Tomato & cheese',
      price: 9.0,
      category: 'main',
    });

    await Menu.create({
      restaurant_id: r3._id,
      name: 'Coffee',
      description: 'Espresso',
      price: 2.5,
      category: 'drink',
    });

    console.log('Seeding done.');
  } catch (err) {
    console.error('Seeding failed:', err && err.message ? err.message : err);
  } finally {
    await close();
    process.exit(0);
  }
}

seed();
