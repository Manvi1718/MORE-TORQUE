# More Torque API

Welcome to the More Torque API! This project provides a RESTful API for managing vehicles and organizations. Below are the instructions to get started with running this API on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Running the Application](#running-the-application)
4. [API Endpoints](#api-endpoints)
5. [Testing with Postman](#testing-with-postman)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (Node Package Manager) or **yarn** (optional)
- **MongoDB** (for local development) or access to a MongoDB Atlas cluster

## Setup Instructions

1. **Clone the Repository**

   Open your terminal or command prompt and run:

   ```bash
   git clone https://github.com/yourusername/more-torque.git
   ```

   Navigate into the project directory:

   ```bash
   cd more-torque
   ```

2. **Install Dependencies**

   Install the required npm packages by running:

   ```bash
   npm install
   ```

   If you prefer `yarn`, you can run:

   ```bash
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project. You need to define the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
   ```

   Replace `<username>`, `<password>`, and `<database>` with your MongoDB credentials and database name.

4. **Create a MongoDB Cluster (if using MongoDB Atlas)**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a new cluster.
   - Create a new database user and configure the IP whitelist.
   - Obtain the connection string and replace the placeholder in the `.env` file.

## Running the Application

1. **Start the Server**

   To start the server, run:

   ```bash
   npm start
   ```

   The server will start and listen on the port specified in the `.env` file (default is 5000). You should see a message:

   ```arduino
   Server running on port 5000
   ```

## API Endpoints

Here are the available API endpoints:

### Vehicles

- **GET** `/vehicles/decode/:vin`  
  Decode a VIN and return vehicle details.

- **POST** `/vehicles`  
  Add a vehicle to the system.

- **GET** `/vehicles/:vin`  
  Fetch a vehicle's details by VIN.

### Organizations

- **POST** `/orgs`  
  Create a new organization.

- **PATCH** `/orgs/:id`  
  Update an existing organization's details.

- **GET** `/orgs`  
  Retrieve information about all organizations.

## Testing with Postman

1. **Open Postman** and create a new request.
2. **Set the HTTP method** (GET, POST, PATCH) according to the API endpoint you want to test.
3. **Enter the API URL** in the request field, e.g., `http://localhost:5000/vehicles/decode/1HGBH41JXMN109186`.
4. **Add headers** and body content as needed for the request type.
5. **Send the request** and view the response.

## Troubleshooting

If you encounter issues:

1. **Check the Console Output** for any errors or warnings.
2. **Ensure MongoDB is Running** and properly configured.
3. **Verify Environment Variables** in the `.env` file are correctly set.
4. **Consult the API Documentation** for the correct endpoint usage.

For further assistance, refer to the [Node.js documentation](https://nodejs.org/en/docs/) or [Express.js documentation](https://expressjs.com/).
