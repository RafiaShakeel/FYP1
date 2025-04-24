const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const path = require('path'); // For serving static files
const fs = require('fs'); // For reading logs
const AdmZip = require('adm-zip');
const cors = require("cors")
const presto = require('presto-client');

const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();
const port = 3000;
const { exec } = require('child_process');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});





// Run a command on WSL
app.get('/start-presto',(req,res)=>{
  exec('wsl python3 /mnt/c/work/presto-server-0.289/bin/launcher.py start', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send(`Error starting Presto: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        res.status(500).send(`Presto stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    res.send(`Presto started successfully: ${stdout}`);
});
});




const catalogDir = 'C:/work/presto-server-0.289/etc/catalog';

function parseProperties(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const properties = {};

  content.split('\n').forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        properties[key.trim()] = value.trim();
      }
    }
  });

  return properties;
}

const pluginsDir =  'C:/work/presto-server-0.289/plugin'; // Replace 'plugins' with your actual directory
function getPlugins() {
  const plugins = [];

  try {
    const directories = fs.readdirSync(pluginsDir, { withFileTypes: true });

    directories.forEach((dir) => {
      if (dir.isDirectory()) {
        const pluginPath = path.join(pluginsDir, dir.name);
        const files = fs.readdirSync(pluginPath);

        let version = 'N/A';

        // Check all JARs for a version
        const jarFiles = files.filter((file) => file.endsWith('.jar'));

        for (const jar of jarFiles) {
          const jarPath = path.join(pluginPath, jar);
          try {
            const zip = new AdmZip(jarPath);
            const manifestEntry = zip.getEntry('META-INF/MANIFEST.MF');

            if (manifestEntry) {
              const manifestContent = manifestEntry.getData().toString('utf8');
              const versionMatch = manifestContent.match(/Implementation-Version: ([^\n\r]+)/);

              if (versionMatch) {
                version = versionMatch[1].trim();
                break; // Stop if we find a version
              }
            }
          } catch (jarError) {
            console.error(`Error reading JAR file ${jar}:`, jarError.message);
          }
        }

        // If no version found, try to extract from file names
        if (version === 'N/A' && jarFiles.length > 0) {
          const versionRegex = /[-_](\d+\.\d+\.\d+)[-_.]/;
          const versionFromFile = jarFiles
            .map((file) => file.match(versionRegex))
            .find((match) => match);

          if (versionFromFile) {
            version = versionFromFile[1];
          }
        }

        plugins.push({
          pluginName: dir.name,
          version: version,
        });
      }
    });
  } catch (error) {
    console.error('Error reading plugins directory:', error.message);
  }

  return plugins;
}

function getCatalogs() {
  const catalogs = [];
  const files = fs.readdirSync(catalogDir);

  files.forEach((file) => {
    if (file.endsWith('.properties')) {
      const propertiesFilePath = path.join(catalogDir, file);
      const properties = parseProperties(propertiesFilePath);

      const datasource = path.parse(file).name; // <--- This is the key part

      catalogs.push({
        datasourcename: datasource,
        connectorname: properties['connector.name'] || 'N/A',
        connectorUrl: properties['connection-url'] || 'N/A',
        username: properties['connection-user'] || 'N/A',
      });
    }
  });

  return catalogs;
}

module.exports = { getCatalogs };


app.post('/create-catalog', (req, res) => {
  const { fileName, content } = req.body;
  const filePath = path.join(catalogDir, fileName);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return res.status(500).send('Error creating catalog file');
    }
    res.send('Catalog file created successfully');
  });
});

app.post('/verify-token', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    res.json(ticket.getPayload());
  } catch (error) {
    res.status(400).send('Invalid ID Token');
  }
});

app.post('/exchange-code', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/home',
      grant_type: 'authorization_code',
    }));
    const ticket = await client.verifyIdToken({
      idToken: response.data.id_token,
      audience: process.env.CLIENT_ID,
    });
    res.json({ ...response.data, user_info: ticket.getPayload() });
  } catch (error) {
    res.status(400).send('Error exchanging code for tokens');
  }
});

const prestoConfig = {
  host: 'http://172.23.193.110',
  port: 8081,
  catalog: 'mysql',
  schema: 'default',
  user: 'rafiashakeek',
};





app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/index.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/index.html')));
app.get('/sign-in', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/signin.html')));
app.get('/sign-up', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/signup.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/index2.html')));
app.get('/logs', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/logs.html')));
app.get('/access-links', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/accesslinks.html')));
app.get('/datasource', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/datasource.html')));
app.get('/test-connection', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/testconnection.html')));
app.get('/plugins', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/plugins.html')));
app.get('/terms-of-use', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/termsOfUse.html')));
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/privacyPolicy.html')));
app.get('/security', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/security.html')));
app.get('/about-us', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/about.html')));
app.get('/team', (req, res) => res.sendFile(path.join(__dirname, 'public/webpages/teams.html')));

app.get('/api/catalogs', (req, res) => {
  const catalogs = getCatalogs();
  res.json(catalogs);
});

app.get('/api/plugins', (req, res) => {
  const plugins = getPlugins();
  res.json(plugins);
});

app.get('/log', (req, res) => {
  const filePath = '\\\\wsl$\\Ubuntu\\var\\presto\\data\\var\\log\\launcher.log';  // Use double backslashes for Windows UNC path

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file at ${filePath}:`, err);  // Log the error details
      return res.status(500).send('Error reading the file');
    }
    res.send(data);
  });
});


app.post('/create-file', (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
      return res.status(400).send('Filename and content are required');
  }
  const filePath = path.join("C:\\work\\presto-server-0.289\\etc\\catalog", filename);

  fs.writeFile(filePath, content, (err) => {
      if (err) {
          return res.status(500).send('Error writing file');
      }
      res.send('File created and data written successfully!');
  });
});
app.delete('/delete-file', (req, res) => {
  const { filename } = req.body;
  const filePath = path.join('C:\\work\\presto-server-0.289\\etc\\catalog', filename);


  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to delete file.");
    }
    res.send("File deleted successfully.");
  });
});
app.post('/read-file', (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    console.log('Filename not provided');
    return res.status(400).send("Filename is required.");
  }

  const filePath = path.join('C:\\work\\presto-server-0.289\\etc\\catalog', filename);
  console.log(`Attempting to read file at: ${filePath}`); // Log the full path

  // First check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File does not exist or cannot be accessed: ${err}`);
      return res.status(404).send("File not found or inaccessible.");
    }

    // If exists, try to read it
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).json({ 
          error: "Failed to read file",
          details: err.message 
        });
      }
      res.json({ content: data });
    });
  });
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));



