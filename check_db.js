const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const Review = require('./src/models/Review');
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(1);
    console.log('\n=== Latest Review in Database ===');
    console.log(JSON.stringify(reviews[0], null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

connectDB();
