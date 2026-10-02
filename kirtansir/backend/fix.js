const mongoose = require('mongoose');
require('dotenv').config();
const StorageLocation = require('./models/StorageLocation');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/warehouse')
  .then(async () => {
    console.log('Connected to DB');
    const locations = await StorageLocation.find();
    for (let loc of locations) {
      if (loc.currentOccupancy > 20 && loc.capacity === 100) {
        loc.currentOccupancy = 20;
        await loc.save();
        console.log('Successfully fixed corrupted laptop occupancy down to 20!');
      }
    }
    console.log('Database math synced.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
