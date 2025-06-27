require('dotenv').config(); 
// Loads your .env file and lets you use process.env.KEY

const express = require('express');
const fetch = require('node-fetch').default; // So we can fetch() in Node.js
const cors = require('cors'); // So frontend (browser) can access backend

const app = express(); // Start express server
const PORT = process.env.PORT || 3000;     // Use port 3000 for local host

app.use(cors({
  origin: "https://ballora.vercel.app",
  credentials: true // if using cookies
}));
// Allow requests from frontend
app.use(express.json());// Parse JSON if frontend sends it

// Route for frontend to call
app.get('/api/players', async (req, res) => {
  const search = req.query.search; // Get ?search= from frontend

  if (!search) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const url = `https://free-api-live-football-data.p.rapidapi.com/football-players-search?search=${encodeURIComponent(search)}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
      'x-rapidapi-key': process.env.API_KEY // secret API key
    }
  };

  try {
    const response = await fetch(url, options); // Call external API
    const data = await response.json();         // Convert to JSON
    res.json(data);                             // Send it to frontend
  } catch (error) {
    console.error('Error fetching player:', error.message);
    res.status(500).json({ error: 'Failed to fetch player info' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅️Server running on http://localhost:${PORT}`);
});
