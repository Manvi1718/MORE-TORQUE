const axios = require('axios');
const { Vehicle, Org } = require('./db'); // Import Vehicle and Org models
// Initialize a cache to store VIN decode results
const cache = new Map();
// Define the rate limit for NHTSA API requests: max 5 requests per minute
const RATE_LIMIT = 5;

// Initialize request counter and reset time
let requestCounter = 0;
let resetTime = Date.now() + 60000; // 60 seconds from now

// Function to decode VIN using NHTSA API and handle rate limiting
async function decodeVIN(vin) {
  const currentTime = Date.now();
  // Reset the request counter and interval if the time window has passed
  if (currentTime > resetTime) {
    resetTime = currentTime + 60000; // Reset time for the next minute
    requestCounter = 0;
  }

  // Check if the request limit has been exceeded
  if (requestCounter >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Try again later.');
  }

  // Check if the VIN data is already in the cache
  if (cache.has(vin)) {
    return cache.get(vin);
  }

  // If not cached, make an API request to decode the VIN
  const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
  const { Results } = response.data;

  // Extract relevant vehicle data from the API response
  const vehicleData = {
    manufacturer: Results[7].Value,
    model: Results[9].Value,
    year: Results[10].Value,
  };

  // Cache the VIN data for future requests
  cache.set(vin, vehicleData);
  requestCounter++; // Increment request counter
  return vehicleData; // Return the vehicle data
}

// Handler for decoding a VIN and returning vehicle details
exports.decodeVehicle = async (req, res) => {
  const { vin } = req.params; // Extract VIN from request parameters
  try {
    // Validate VIN format (17 alphanumeric characters)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }
    // Get vehicle data by decoding the VIN
    const vehicle = await decodeVIN(vin);
    res.status(200).json(vehicle); // Return vehicle data with 200 status
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error message with 500 status
  }
};

// Handler for adding a vehicle to the system
exports.addVehicle = async (req, res) => {
  const { vin, org } = req.body; // Extract VIN and org from request body
  try {
    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }

    // Check if the provided organization exists
    const orgExists = await Org.findById(org);
    if (!orgExists) {
      return res.status(400).json({ error: 'Organization not found' });
    }

    // Decode VIN to get vehicle data
    const vehicleData = await decodeVIN(vin);
    // Create a new vehicle record with the decoded data and organization
    const vehicle = new Vehicle({ vin, ...vehicleData, org });
    await vehicle.save(); // Save the vehicle record to the database

    res.status(201).json(vehicle); // Return created vehicle with 201 status
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error message with 500 status
  }
};

// Handler for getting vehicle details by VIN
exports.getVehicle = async (req, res) => {
  const { vin } = req.params; // Extract VIN from request parameters
  try {
    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }

    // Find the vehicle by VIN and populate organization details
    const vehicle = await Vehicle.findOne({ vin }).populate('org');
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.status(200).json(vehicle); // Return vehicle details with 200 status
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error message with 500 status
  }
};
