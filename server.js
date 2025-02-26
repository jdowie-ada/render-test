import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get the directory name using ES Modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to proxy requests to Supabase
app.get('/api/messages', async (req, res) => {
  try {
    // Get the Supabase anon key from environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseAnonKey) {
      throw new Error('Supabase anon key is not configured');
    }

    // Make the request to Supabase with the API key in headers
    const response = await fetch(`${supabaseUrl}/functions/v1/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    // Get the data
    const data = await response.json();
    
    // Send the data back to the client
    res.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});