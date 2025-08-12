const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectToMongo } = require('./db');
const { createRouter } = require('./routes/weather');

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || '';

async function start() {
  const app = express();
  app.use(cors({ origin: CLIENT_ORIGIN }));
  app.use(express.json());

  const mongoConn = await connectToMongo(MONGODB_URI);
  const hasPersistence = !!mongoConn;

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', createRouter({ hasPersistence }));

  // Serve client build in production if present
  const clientDistPath = path.join(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();