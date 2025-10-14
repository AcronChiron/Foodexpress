const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          // simple phone validation: digits, spaces, +, -, parentheses
          return /^[0-9+()\-\s]{6,20}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    opening_hours: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

restaurantSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
