const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ejemplo de ruta GET
app.get('/items', (req, res) => {
  res.json([{ name: 'Item1', price: 50 }, { name: 'Item2', price: 100 }]);
});

// Ejemplo de ruta POST
app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = Math.floor(Math.random() * 1000);
  res.status(201).json(newItem);
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
