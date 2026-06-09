const { exec } = require('child_process');
const path = require('path');

exports.predictPrice = (req, res) => {
  let { house_size, numBathrooms, numBalconies, priceSqFt } = req.body;

  // Validate required inputs
  if (house_size === undefined || house_size === null || house_size === '' ||
      numBathrooms === undefined || numBathrooms === null || numBathrooms === '') {
    return res.status(400).json({ error: 'Missing required parameters: house_size and numBathrooms are required' });
  }
  
  // Set numBalconies to 0 if not provided (it's optional now)
  if (numBalconies === undefined || numBalconies === null || numBalconies === '') {
    numBalconies = 0;
  }

  // Convert to numbers
  house_size = parseFloat(house_size);
  numBathrooms = parseInt(numBathrooms);
  numBalconies = parseInt(numBalconies);
  priceSqFt = priceSqFt ? parseFloat(priceSqFt) : null;

  // Validate house_size (based on dataset range)
  if (house_size < 200 || house_size > 5000) {
    return res.status(400).json({ error: 'house_size must be between 200 and 5000 sqft' });
  }

  // Validate bathrooms
  if (numBathrooms < 1 || numBathrooms > 10) {
    return res.status(400).json({ error: 'numBathrooms must be between 1 and 10' });
  }

  // Validate balconies
  if (numBalconies < 0 || numBalconies > 5) {
    return res.status(400).json({ error: 'numBalconies must be between 0 and 5' });
  }

  // Calculate priceSqFt if not provided or invalid
  if (priceSqFt === undefined || priceSqFt === null || priceSqFt <= 0) {
    // Use dataset-based defaults for Delhi rental market
    // Analysis of cleaned_dataset.csv shows typical priceSqFt ranges:
    // Studio/1BHK (<=500 sqft): ~45 Rs/sqft
    // 2BHK (500-800 sqft): ~35 Rs/sqft
    // 3BHK (800-1500 sqft): ~30 Rs/sqft
    // 4BHK+ (>1500 sqft): ~40 Rs/sqft
    if (house_size <= 500) {
      priceSqFt = 45;
    } else if (house_size <= 800) {
      priceSqFt = 35;
    } else if (house_size <= 1500) {
      priceSqFt = 30;
    } else {
      priceSqFt = 40;
    }
    console.log(`Using default priceSqFt: ${priceSqFt} based on house_size: ${house_size}`);
  }

  // Validate priceSqFt
  if (priceSqFt < 10 || priceSqFt > 150) {
    return res.status(400).json({ error: 'priceSqFt must be between 10 and 150 Rs/sqft' });
  }

  console.log('Prediction request:', { house_size, numBathrooms, numBalconies, priceSqFt });
  
  // Get the absolute path to the predict.py script
  const scriptPath = path.join(__dirname, '../../../ml-model/predict.py');
  console.log('Script path:', scriptPath);

  // Execute the Python script
  const pythonCommand = `python "${scriptPath}" ${house_size} ${numBathrooms} ${numBalconies} ${priceSqFt}`;
  console.log('Executing:', pythonCommand);
  
  exec(
    pythonCommand,
    (err, stdout, stderr) => {
      if (err) {
        console.error('Python script error:', err);
        console.error('stderr:', stderr);
        return res.status(500).json({ error: err.message, stderr: stderr });
      }
      
      if (stderr) {
        console.warn('Python script warning:', stderr);
      }

      const predictedPrice = parseFloat(stdout.trim());
      
      // Validate prediction is within reasonable range (dataset: 5000-250000 Rs/month)
      if (isNaN(predictedPrice) || predictedPrice < 1000 || predictedPrice > 500000) {
        console.error('Invalid prediction:', predictedPrice);
        return res.status(500).json({ error: 'Invalid prediction result', rawOutput: stdout });
      }

      console.log('Predicted price:', predictedPrice);

      res.json({
        success: true,
        predictedPrice: Math.round(predictedPrice),
        inputFeatures: { house_size, numBathrooms, numBalconies, priceSqFt }
      });
    }
  );
};
