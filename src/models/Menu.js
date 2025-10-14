const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be >= 0'],
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

menuSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
