// Import the mongoose module to interact with MongoDB
const mongoose = require('mongoose');

// Connect to MongoDB using the connection string
// Note: Make sure to replace the connection string with your own, and avoid including sensitive information in your code.
mongoose.connect("mongodb+srv://manvi1718:YV$f8fm.BC@Esiu@manvi.rwhon.mongodb.net/", {
    useNewUrlParser: true, // Use the new URL string parser for compatibility
    useUnifiedTopology: true // Use the new Server Discover and Monitoring engine
})
.then(() => console.log('MongoDB connected successfully')) // Log a success message when connected
.catch(err => console.error('MongoDB connection error:', err)); // Log an error if the connection fails

// Define a schema for the Vehicle model
const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true, length: 17 }, // Vehicle Identification Number (VIN) is a required unique 17-character string
    manufacturer: String, // Manufacturer of the vehicle
    model: String, // Model of the vehicle
    year: Number, // Manufacturing year of the vehicle
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' } // Reference to the Org model, indicating the organization that owns the vehicle
});
  
// Create a Vehicle model based on the vehicleSchema
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Define a schema for the Org model
const orgSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Organization name is required and must be unique
    account: String, // Account details for the organization
    website: String, // Website of the organization
    fuelReimbursementPolicy: { type: String, default: '1000' }, // Fuel reimbursement policy with a default value of '1000'
    speedLimitPolicy: String, // Speed limit policy of the organization
    parentOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' }, // Reference to the parent organization (if any)
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Org' }] // Array of references to child organizations
});
  
// Middleware function to set the fuel reimbursement policy before saving an organization
orgSchema.pre('save', async function(next) {
    // Check if the organization has a parent organization
    if (this.parentOrg) {
        // Find the parent organization by its ID
        const parent = await this.model('Org').findById(this.parentOrg);
        // If the parent organization is found, inherit its fuel reimbursement policy
        if (parent) {
            this.fuelReimbursementPolicy = parent.fuelReimbursementPolicy;
        }
    }
    // Proceed with saving the organization
    next();
});
  
// Create an Org model based on the orgSchema
const Org = mongoose.model('Org', orgSchema);

// Export the Vehicle and Org models for use in other parts of the application
module.exports = {
    Vehicle,
    Org
};
