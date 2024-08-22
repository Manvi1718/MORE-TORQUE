const express = require('express');
const { decodeVehicle, addVehicle, getVehicle } = require('./vehiclecontroller'); // Import controller functions

const router = express.Router(); // Create a new router object for handling routes

// Route to decode a VIN and return vehicle details
router.get('/decode/:vin', decodeVehicle); // GET request to /vehicles/decode/:vin

// Route to add a vehicle to the system
router.post('/', addVehicle); // POST request to /vehicles

// Route to get a vehicle's details by VIN
router.get('/:vin', getVehicle); // GET request to /vehicles/:vin

module.exports = router; // Export the router to be used in the main app file
