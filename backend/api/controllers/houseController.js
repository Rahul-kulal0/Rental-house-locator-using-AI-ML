const House = require("../../models/House");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// GET all houses
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();

    res.status(200).json({
      success: true,
      total: houses.length,
      data: houses
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

exports.filterHouses = async (req, res) => {
  try {
    let query = {};

    // city
    if (req.query.city) {
      query.city = { $regex: req.query.city, $options: "i" };
    }

    // price range
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { 
        $gte: Number(req.query.minPrice), 
        $lte: Number(req.query.maxPrice) 
      };
    }

    // bedrooms / house size
    if (req.query.bhk) {
      query.house_size = Number(req.query.bhk);
    }

    // bathrooms
    if (req.query.bathrooms) {
      query.numBathrooms = Number(req.query.bathrooms);
    }

    // negotiable
    if (req.query.negotiable === "true") {
      query.isNegotiable = true;
    }

    // verified filter
    if (req.query.verified === "true") {
      query.isVerified = true;
    }

    // furnishing based on type
    if (req.query.furnishing) {
      const type = req.query.furnishing;

      if (type === "unfurnished") {
        query.house_type = { $regex: "Independent|Studio", $options: "i" };
      } else if (type === "semi") {
        query.house_type = { $regex: "Studio", $options: "i" };
      } else if (type === "full") {
        query.house_type = { $regex: "Bhk", $options: "i" };
      }
    }

    const houses = await House.find(query).limit(50);

    res.json({ success: true, data: houses });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getHouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const house = await House.findById(id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Invalid ID or Server Error",
      error: err.message,
    });
  }
};

exports.paginateHouses = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 12;

    let skip = (page - 1) * limit;

    const houses = await House.find().skip(skip).limit(limit);
    const total = await House.countDocuments();

    res.json({
      success: true,
      data: houses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSimilarHouses = async (req, res) => {
  try {
    const { id } = req.params;

    const targetHouse = await House.findById(id);
    if (!targetHouse) {
      return res.status(404).json({ message: "House not found" });
    }

    const similar = await House.find({
      _id: { $ne: id },
      city: targetHouse.city,
      house_type: targetHouse.house_type
    }).limit(6);

    res.json({ success: true, data: similar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchLocations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const houses = await House.find({
      $or: [
        { location: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { house_type: { $regex: query, $options: "i" } }
      ]
    }).limit(10);

    res.json({ success: true, data: houses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find houses from ML dataset
exports.findHousesFromDataset = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bhk, location } = req.query;
    const datasetPath = path.join(__dirname, '../../../ml-model/cleaned_dataset.csv');
    
    const results = [];

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        let match = true;

        // Filter by city
        if (city && row.city && !row.city.toLowerCase().includes(city.toLowerCase())) {
          match = false;
        }

        // Filter by location (also search in city and house_type if location is provided)
        if (location && row.location) {
          const searchTerm = location.toLowerCase();
          const locationMatch = row.location.toLowerCase().includes(searchTerm);
          const cityMatch = row.city && row.city.toLowerCase().includes(searchTerm);
          const houseTypeMatch = row.house_type && row.house_type.toLowerCase().includes(searchTerm);
          
          if (!locationMatch && !cityMatch && !houseTypeMatch) {
            match = false;
          }
        }

        // Filter by price range
        const price = parseFloat(row.price);
        if (minPrice && price < parseFloat(minPrice)) {
          match = false;
        }
        if (maxPrice && price > parseFloat(maxPrice)) {
          match = false;
        }

        // Filter by BHK (house type)
        if (bhk && row.house_type && !row.house_type.toLowerCase().includes(bhk)) {
          match = false;
        }

        if (match) {
          results.push({
            location: row.location,
            city: row.city,
            price: parseFloat(row.price),
            house_type: row.house_type,
            house_size: parseFloat(row.house_size),
            numBathrooms: parseInt(row.numBathrooms),
            numBalconies: parseInt(row.numBalconies),
            priceSqFt: parseFloat(row.priceSqFt),
            isNegotiable: row.isNegotiable === 'True' || row.isNegotiable === 'true',
            isVerified: row.isVerified === 'True' || row.isVerified === 'true',
            SecurityDeposit: parseFloat(row.SecurityDeposit || 0),
            description: row.description || '',
            latitude: parseFloat(row.latitude) || null,
            longitude: parseFloat(row.longitude) || null
          });
        }
      })
      .on('end', () => {
        // Sort by price (ascending)
        results.sort((a, b) => a.price - b.price);
        
        // Limit results to 50
        const limitedResults = results.slice(0, 50);
        
        res.json({
          success: true,
          total: results.length,
          showing: limitedResults.length,
          data: limitedResults
        });
      })
      .on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get dataset statistics
exports.getDatasetStats = async (req, res) => {
  try {
    const datasetPath = path.join(__dirname, '../../../ml-model/cleaned_dataset.csv');
    const stats = {
      totalHouses: 0,
      cities: {},
      priceRange: { min: Infinity, max: -Infinity },
      avgPrice: 0,
      houseTypes: {}
    };

    let totalPrice = 0;

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        stats.totalHouses++;

        // Count cities
        const city = row.city || 'Unknown';
        stats.cities[city] = (stats.cities[city] || 0) + 1;

        // Track price range
        const price = parseFloat(row.price);
        if (!isNaN(price)) {
          if (price < stats.priceRange.min) stats.priceRange.min = price;
          if (price > stats.priceRange.max) stats.priceRange.max = price;
          totalPrice += price;
        }

        // Count house types
        const houseType = row.house_type || 'Unknown';
        stats.houseTypes[houseType] = (stats.houseTypes[houseType] || 0) + 1;
      })
      .on('end', () => {
        stats.avgPrice = Math.round(totalPrice / stats.totalHouses);
        
        res.json({
          success: true,
          stats: stats
        });
      })
      .on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get house by ID from ML dataset
exports.getHouseFromDataset = async (req, res) => {
  try {
    const { id } = req.params;
    const datasetPath = path.join(__dirname, '../../../ml-model/cleaned_dataset.csv');
    
    let foundHouse = null;
    let rowIndex = 0;

    // Check if the ID is in the format "location-price" (from frontend)
    // or in the format "rowIndex-location-price" (from backend)
    let searchLocation, searchPrice;
    
    if (id.includes('-')) {
      const parts = id.split('-');
      if (parts.length >= 2) {
        // Try to parse as "location-price" format
        searchPrice = parts[parts.length - 1];
        searchLocation = parts.slice(0, parts.length - 1).join('-');
      }
    }

    const stream = fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        // Create a unique ID based on row index and some house properties
        const rowIdByIndex = `${rowIndex}-${row.location}-${row.price}`;
        const rowIdByLocation = `${row.location}-${row.price}`;
        
        // Check if this row matches the requested ID
        if (rowIdByIndex === id || rowIdByLocation === id || 
            (searchLocation && searchPrice && 
             row.location === searchLocation && 
             parseFloat(row.price) == parseFloat(searchPrice))) {
          foundHouse = {
            _id: rowIdByLocation,
            location: row.location,
            city: row.city,
            price: parseFloat(row.price),
            house_type: row.house_type,
            house_size: parseFloat(row.house_size),
            numBathrooms: parseInt(row.numBathrooms),
            numBalconies: parseInt(row.numBalconies),
            priceSqFt: parseFloat(row.priceSqFt),
            isNegotiable: row.isNegotiable === 'True' || row.isNegotiable === 'true',
            isVerified: row.isVerified === 'True' || row.isVerified === 'true',
            SecurityDeposit: parseFloat(row.SecurityDeposit || 0),
            description: row.description || '',
            latitude: parseFloat(row.latitude) || null,
            longitude: parseFloat(row.longitude) || null
          };
          stream.destroy(); // Stop reading once found
        }
        
        rowIndex++;
      })
      .on('end', () => {
        if (foundHouse) {
          res.json({
            success: true,
            data: foundHouse
          });
        } else {
          res.status(404).json({
            success: false,
            message: "House not found"
          });
        }
      })
      .on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get similar houses from ML dataset
exports.getSimilarHousesFromDataset = async (req, res) => {
  try {
    const { id } = req.params;
    const datasetPath = path.join(__dirname, '../../../ml-model/cleaned_dataset.csv');
    
    let targetHouse = null;
    let rowIndex = 0;

    // Check if the ID is in the format "location-price" (from frontend)
    let searchLocation, searchPrice;
    
    if (id.includes('-')) {
      const parts = id.split('-');
      if (parts.length >= 2) {
        // Try to parse as "location-price" format
        searchPrice = parts[parts.length - 1];
        searchLocation = parts.slice(0, parts.length - 1).join('-');
      }
    }

    // First, find the target house
    const findStream = fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (row) => {
        const rowIdByIndex = `${rowIndex}-${row.location}-${row.price}`;
        const rowIdByLocation = `${row.location}-${row.price}`;
        
        if (rowIdByIndex === id || rowIdByLocation === id || 
            (searchLocation && searchPrice && 
             row.location === searchLocation && 
             parseFloat(row.price) == parseFloat(searchPrice))) {
          targetHouse = {
            location: row.location,
            city: row.city,
            price: parseFloat(row.price),
            house_type: row.house_type,
            house_size: parseFloat(row.house_size),
            numBathrooms: parseInt(row.numBathrooms),
            numBalconies: parseInt(row.numBalconies),
            priceSqFt: parseFloat(row.priceSqFt),
            isNegotiable: row.isNegotiable === 'True' || row.isNegotiable === 'true',
            isVerified: row.isVerified === 'True' || row.isVerified === 'true',
            SecurityDeposit: parseFloat(row.SecurityDeposit || 0),
            description: row.description || '',
            latitude: parseFloat(row.latitude) || null,
            longitude: parseFloat(row.longitude) || null
          };
          findStream.destroy();
        }
        
        rowIndex++;
      })
      .on('end', async () => {
        if (!targetHouse) {
          return res.status(404).json({ success: false, message: "House not found" });
        }

        // Now find similar houses
        const similar = [];
        let simRowIndex = 0;
        
        const similarStream = fs.createReadStream(datasetPath)
          .pipe(csv())
          .on('data', (row) => {
            const rowIdByIndex = `${simRowIndex}-${row.location}-${row.price}`;
            const rowIdByLocation = `${row.location}-${row.price}`;
            
            // Skip the target house itself
            if (rowIdByIndex === id || rowIdByLocation === id || 
                (searchLocation && searchPrice && 
                 row.location === searchLocation && 
                 parseFloat(row.price) == parseFloat(searchPrice))) {
              simRowIndex++;
              return;
            }
            
            // Check if house is similar (same city and house type)
            if (row.city === targetHouse.city && row.house_type === targetHouse.house_type) {
              similar.push({
                _id: rowIdByLocation,
                location: row.location,
                city: row.city,
                price: parseFloat(row.price),
                house_type: row.house_type,
                house_size: parseFloat(row.house_size),
                numBathrooms: parseInt(row.numBathrooms),
                numBalconies: parseInt(row.numBalconies),
                priceSqFt: parseFloat(row.priceSqFt),
                isNegotiable: row.isNegotiable === 'True' || row.isNegotiable === 'true',
                isVerified: row.isVerified === 'True' || row.isVerified === 'true',
                SecurityDeposit: parseFloat(row.SecurityDeposit || 0),
                description: row.description || '',
                latitude: parseFloat(row.latitude) || null,
                longitude: parseFloat(row.longitude) || null
              });
              
              // Limit to 6 similar houses
              if (similar.length >= 6) {
                similarStream.destroy();
              }
            }
            
            simRowIndex++;
          })
          .on('end', () => {
            res.json({
              success: true,
              data: similar
            });
          })
          .on('error', (error) => {
            res.status(500).json({ success: false, error: error.message });
          });
      })
      .on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
      });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
