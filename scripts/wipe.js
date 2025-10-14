#!/usr/bin/env node
/* Wipe script for FoodExpress - empties users, restaurants, menus
   Usage: node scripts/wipe.js
   WARNING: run in dev/test only
*/

const { connect, close } = require('../src/config/mongodb');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

async function wipe() {
  await connect();
  try {
    await Promise.all([User.deleteMany({}), Restaurant.deleteMany({}), Menu.deleteMany({})]);
    console.log('Wipe done.');
  } catch (err) {
    console.error('Wipe failed:', err && err.message ? err.message : err);
  } finally {
    await close();
    process.exit(0);
  }
}

wipe();
