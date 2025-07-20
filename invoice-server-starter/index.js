const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // adresa React klienta
  credentials: true
}));
app.use(express.json());

// Ukázkový endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funguje!' });
});

// Spuštění serveru
app.listen(3000, () => {
  console.log('Backend běží na http://localhost:3000');
});
