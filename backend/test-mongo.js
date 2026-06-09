const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGO_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
console.log('\nAttempting to connect...\n');

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connected successfully!');
  console.log('✅ Your connection string is working correctly.');
  process.exit(0);
})
.catch(err => {
  console.error('❌ FAILED! MongoDB connection error:\n');
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Error Reason:', err.reason);
  
  console.log('\n--- TROUBLESHOOTING STEPS ---\n');
  console.log('1. CHECK INTERNET CONNECTION');
  console.log('   - Make sure you are connected to the internet');
  console.log('   - Try opening mongodb.com in your browser\n');
  
  console.log('2. VERIFY MONGODB ATLAS CREDENTIALS');
  console.log('   - Username: rahul');
  console.log('   - Cluster: cluster0.ngitxg4.mongodb.net');
  console.log('   - Database: rental_house_locator');
  console.log('   - Check if password "rentalhouselocator" is correct\n');
  
  console.log('3. WHITELIST YOUR IP ADDRESS');
  console.log('   - Go to https://cloud.mongodb.com/');
  console.log('   - Click on "Network Access" in the left sidebar');
  console.log('   - Click "Add IP Address"');
  console.log('   - Either:');
  console.log('     * Click "Add Current IP Address" (recommended)');
  console.log('     * OR click "Allow Access from Anywhere" (0.0.0.0/0) for testing');
  console.log('   - Click "Confirm"\n');
  
  console.log('4. CHECK DNS RESOLUTION');
  console.log('   - Open Command Prompt and run:');
  console.log('     nslookup cluster0.ngitxg4.mongodb.net');
  console.log('   - If this fails, try changing your DNS to Google DNS (8.8.8.8)\n');
  
  console.log('5. DISABLE FIREWALL/ANTIVIRUS TEMPORARILY');
  console.log('   - Some firewalls block MongoDB connections');
  console.log('   - Try temporarily disabling to test\n');
  
  console.log('6. GET NEW CONNECTION STRING');
  console.log('   - Go to MongoDB Atlas: https://cloud.mongodb.com/');
  console.log('   - Click "Connect" on your cluster');
  console.log('   - Choose "Connect your application"');
  console.log('   - Copy the connection string');
  console.log('   - Replace the MONGO_URL in your .env file\n');
  
  process.exit(1);
});
