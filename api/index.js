// FinalYearProject/api/index.js (New File)

// Import the exported Express app from your backend folder
const app = require('../backend/server'); 

// Vercel requires the app to be exported directly as the request handler
module.exports = app;