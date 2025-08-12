const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);