// Import the express module and the controller functions
const express = require('express');
const { createOrg, updateOrg, getAllOrgs } = require('./orgcontroller');

// Create an Express router instance
const router = express.Router();

// Define a route to handle POST requests for creating a new organization
// This route maps to the 'createOrg' function from the controller
router.post('/', createOrg);

// Define a route to handle PATCH requests for updating an existing organization
// The ':id' in the URL is a route parameter that specifies the ID of the organization to update
// This route maps to the 'updateOrg' function from the controller
router.patch('/:id', updateOrg);

// Define a route to handle GET requests for retrieving all organizations
// This route maps to the 'getAllOrgs' function from the controller
router.get('/', getAllOrgs);

// Export the router so it can be used in other parts of the application
module.exports = router;
