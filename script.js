const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path'); // For serving the static index.html file

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (like images, CSS, JavaScript) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Presto server configuration
const prestoConfig = {
    host: 'http://172.23.193.110', // Replace with your Presto server address
    port: 8081,                    // Presto server port
    catalog: 'mysql',               // Catalog name
    schema: 'default',             // Schema name
    user: 'rafiashakeek',         // Replace with your username
};
// Enable CORS for all domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next(); // Pass control to the next handler
});

// API endpoint to query Presto
app.post('/query-presto', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await axios.post(
            `${prestoConfig.host}:${prestoConfig.port}/v1/statement`,
            query,
            {
                headers: {
                    'X-Presto-Catalog': prestoConfig.catalog,
                    'X-Presto-Schema': prestoConfig.schema,
                    'X-Presto-User': prestoConfig.user,
                },
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Presto Query Error:', error.message);
        res.json({ success: false, error: error.message });
    }
});

// Route for the root URL to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/index.html')); // Update path to your file
  });

// Alternatively, if you want to specifically handle '/index.html'
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/index.html'));
});

app.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/signin.html'));
});


// Alternatively, if you want to specifically handle '/index.html'
app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/signup.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/index2.html'));
});

app.get('/logs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/logs.html'));
});

app.get('/access-links', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/accesslinks.html'));
});

app.get('/datasource', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/datasource.html'));
});

app.get('/test-connection', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/webpages/testconnection.html'));
});

// Endpoint to get the file contents
app.get('/log', (req, res) => {
    const filePath = '\\\\wsl$\\Ubuntu\\var\\presto\\data\\var\\log\\launcher.log'; // Path to your file
  
    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading the file');
        return;
      }
      res.send(data); // Send the file content
    });
  });

//presto-qeury
app.post("/query-presto", async (req, res) => {
    const { query } = req.body; // Get the query from the request
  
    if (!query) {
      return res.status(400).json({ success: false, error: "Query is required" });
    }
  
    try {
      // Send the query to Presto
      const response = await axios.post(PRESTO_SERVER_URL, query, { headers: PRESTO_HEADERS });
  
      // Process the response from Presto
      const { data } = response;
      res.json({
        success: true,
        data, // Include the entire response from Presto
      });
    } catch (error) {
      // Handle errors
      console.error("Error querying Presto:", error.message);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });
  

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
