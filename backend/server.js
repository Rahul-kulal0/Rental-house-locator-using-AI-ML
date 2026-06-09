const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority'
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Error code:", err.code);
    console.error("Error details:", err.errmsg || '');
    console.warn("⚠️  Server will continue without database. Some features may not work.");
    console.warn("💡 To fix this:");
    console.warn("   1. Check your internet connection");
    console.warn("   2. Verify MongoDB Atlas connection string");
    console.warn("   3. Ensure your IP address is whitelisted in MongoDB Atlas");
    console.warn("   4. Check if cluster0.ngitxg4.mongodb.net is accessible");
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
