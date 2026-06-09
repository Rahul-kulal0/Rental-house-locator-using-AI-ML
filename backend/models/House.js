const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    house_type: { type: String, required: false },
    house_size: { type: Number, required: false },

    location: { type: String, required: true },
    city: { type: String, required: true },

    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    price: { type: Number, required: true },

    numBathrooms: { type: Number, default: 1 },
    numBalconies: { type: Number, default: 0 },

    isNegotiable: { type: Boolean, default: false },
    priceSqFt: { type: Number, required: false },

    description: { type: String, default: "No description available" },

    SecurityDeposit: { type: Number, default: 0 },
    
    ownerName: { type: String, default: "Owner" },
    ownerPhone: { type: String, default: "" },

    isVerified: { type: Boolean, default: false },


    image: {
      type: String,
      default: "https://via.placeholder.com/400",
    }

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);
