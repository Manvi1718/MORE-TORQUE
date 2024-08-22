// Import necessary modules
const express = require('express'); // Import Express.js, a web application framework for Node.js
const vehicleRoutes = require('./vehiclerouter'); // Import the vehicle-related routes from the vehiclerouter.js file
const orgRoutes = require('./orgroutes'); // Import the organization-related routes from the orgroutes.js file
const rateLimit = require('./ratelimitMiddle'); // Import the rate-limiting middleware from ratelimitMiddle.js
console.log("1"); // Log "1" to the console to verify the code is running
require('dotenv').config(); // Load environment variables from a .env file into process.env

// Initialize Express app
const app = express(); // Create an instance of an Express application

// Middleware to parse incoming JSON requests
app.use(express.json()); // This middleware parses incoming JSON requests and puts the parsed data in req.body

// Rate limiting middleware for NHTSA API calls
// Limits requests to the /vehicles/decode/:vin endpoint to 5 requests per minute (60000 milliseconds)
app.use('/vehicles/decode/:vin', rateLimit(5, 60000)); // This middleware is applied to control the rate of API requests to avoid overloading the NHTSA API

// Routes for handling vehicle-related API requests
app.use('/vehicles', vehicleRoutes); // Attach the vehicle-related routes to the /vehicles path

// Routes for handling organization-related API requests
app.use('/orgs', orgRoutes); // Attach the organization-related routes to the /orgs path

// Define the port number for the server to listen on
const PORT = process.env.PORT || 5000; // Set the port from the environment variable PORT, or default to 5000 if not set

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log a message to the console indicating it is running
