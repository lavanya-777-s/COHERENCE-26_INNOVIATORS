// backend/seeds/createGovernmentUsers.js

const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Delete existing users
    await User.deleteMany({});
    console.log('🗑️  Old users deleted');

    // ✅ FIX: Use individual .save() instead of insertMany()
    // insertMany() bypasses mongoose pre-save hook (password hashing!)
    
    const usersData = [
      {
        name: 'Raj Official',
        email: 'official@gov.in',
        password: 'Official123',
        role: 'official'
      },
      {
        name: 'Priya Auditor',
        email: 'auditor@gov.in',
        password: 'Auditor123',
        role: 'auditor'
      },
      {
        name: 'Amit Analyst',
        email: 'analyst@gov.in',
        password: 'Analyst123',
        role: 'analyst',
        department: 'Health'
      }
    ];

    // ✅ Loop se har user ko individually save karo
    // .save() call hoga toh pre-save hook chalega → password hash hoga
    for (const userData of usersData) {
      const user = new User(userData);
      await user.save(); // ← pre-save hook triggers here ✅
      console.log(`✅ Created: ${user.email} (${user.role})`);
    }

    console.log('\n🎉 3 government users created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Official : official@gov.in / Official123');
    console.log('Auditor  : auditor@gov.in  / Auditor123');
    console.log('Analyst  : analyst@gov.in  / Analyst123');

    await mongoose.disconnect();
    console.log('\nMongoDB disconnected. Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUsers();