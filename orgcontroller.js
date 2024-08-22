// Import the Org model from the database module
const { Org } = require('./db');

// Controller function to handle the creation of a new organization
exports.createOrg = async (req, res) => {
  try {
    // Create a new organization document using the data from the request body
    const org = new Org(req.body);
    
    // Save the organization to the database
    await org.save();
    
    // Send a response with status code 201 (Created) and the created organization
    res.status(201).json(org);
  } catch (error) {
    // Send a response with status code 400 (Bad Request) and an error message if there's an issue
    res.status(400).json({ error: error.message });
  }
};

// Controller function to handle the update of an existing organization
exports.updateOrg = async (req, res) => {
  // Extract the organization ID from the request parameters
  const { id } = req.params;
  
  try {
    // Find the organization by its ID
    const org = await Org.findById(id);
    
    // If the organization is not found, return a 404 error
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Update the organization with the data from the request body
    Object.assign(org, req.body);

    // If updating the fuelReimbursementPolicy, check if it's allowed
    if (req.body.fuelReimbursementPolicy && org.parentOrg) {
      // Find the parent organization
      const parent = await Org.findById(org.parentOrg);
      
      // If the parent exists and the new policy differs from the parent's policy, return a 400 error
      if (parent && parent.fuelReimbursementPolicy !== req.body.fuelReimbursementPolicy) {
        return res.status(400).json({ error: 'Child organization cannot override inherited fuel reimbursement policy' });
      }
    }

    // Save the updated organization to the database
    await org.save();
    
    // Send a response with status code 200 (OK) and the updated organization
    res.status(200).json(org);
  } catch (error) {
    // Send a response with status code 400 (Bad Request) and an error message if there's an issue
    res.status(400).json({ error: error.message });
  }
};

// Controller function to handle retrieving all organizations
exports.getAllOrgs = async (req, res) => {
  try {
    // Find all organizations and populate the parentOrg and children fields with related documents
    const orgs = await Org.find().populate('parentOrg').populate('children');
    
    // Send a response with status code 200 (OK) and the list of organizations
    res.status(200).json(orgs);
  } catch (error) {
    // Send a response with status code 400 (Bad Request) and an error message if there's an issue
    res.status(400).json({ error: error.message });
  }
};
