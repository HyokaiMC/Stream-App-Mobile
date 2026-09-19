const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function checkToken(req, res, next) {
  const token = req.header('X-Auth-Token');
  if (!token || token !== config.token) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

function runAction(button) {
  switch (button.type) {
    case 'open_app':
      return exec(`start "" "${button.target}"`);
    case 'open_folder':
      return exec(`explorer "${button.target}"`);
    case 'open_url':
      return exec(`start "" "${button.target}"`);
    case 'close_app':
      return exec(`taskkill /IM "${button.target}" /F`);
    default:
      throw new Error(`type d'action inconnu: ${button.type}`);
  }
}

app.get('/buttons', checkToken, (req, res) => {
  const publicButtons = config.buttons.map(({ id, label }) => ({ id, label }));
  res.json(publicButtons);
});

app.post('/run/:id', checkToken, (req, res) => {
  const button = config.buttons.find((b) => b.id === req.params.id);
  if (!button) return res.status(404).json({ error: 'bouton inconnu' });

  try {
    runAction(button);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`StreamDeck server pret sur http://<IP-de-ce-PC>:${config.port}`);
  console.log('Modifie server/config.json pour ajouter tes propres boutons.');
});
