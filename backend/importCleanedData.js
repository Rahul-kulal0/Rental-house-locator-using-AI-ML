const mongoose = require("mongoose");
const csv = require("csvtojson");
const House = require("./models/House");
require("dotenv").config();

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

async function importData() {
  try {
    console.log("⏳ Reading cleaned dataset...");

    const records = await csv().fromFile("./cleaned_dataset.csv");

    console.log(`Found ${records.length} records`);

    const formatted = records.map((row) => ({
      house_type: row.house_type,
      house_size: Number(row.house_size),
      location: row.location,
      city: row.city,
      latitude: row.latitude ? Number(row.latitude) : null,
      longitude: row.longitude ? Number(row.longitude) : null,
      price: Number(row.price),
      numBathrooms: row.numBathrooms ? Number(row.numBathrooms) : 1,
      numBalconies: row.numBalconies ? Number(row.numBalconies) : 0,
      isNegotiable: row.isNegotiable === "True" || row.isNegotiable === "true",
      priceSqFt: Number(row.priceSqFt),
      description: row.description || "No description available",
      SecurityDeposit: Number(row.SecurityDeposit),
      image: "https://via.placeholder.com/400",

      // ⭐ ADD OWNER INFO HERE
      ownerName: row.ownerName || "Owner",
      ownerPhone: row.ownerPhone || `98${Math.floor(Math.random() * 100000000)}`,

      isVerified: Math.random() < 0.5, // 50% properties verified

    }));

    // Insert into MongoDB
    await House.insertMany(formatted);

    console.log("✅ Cleaned dataset imported successfully!");
    process.exit();

  } catch (err) {
    console.error("❌ Import Error:", err);
    process.exit(1);
  }
}

importData();



