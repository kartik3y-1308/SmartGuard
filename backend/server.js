const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize Express app
const app = express();

// Connect to the Database
connectDB();

// Initialize Middleware
app.use(cors()); // Allows cross-origin requests from your frontend
app.use(express.json()); // Allows the app to accept JSON in the request body

// --- Define API Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/scan", require("./routes/scan"));
app.use("/api/user", require("./routes/user"));
app.use('/api/email', require('./routes/email'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/list', require('./routes/list'));

// A simple route to check if the API is up and running
app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
