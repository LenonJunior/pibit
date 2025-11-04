const express = require('express');
const cors = require('cors'); 
const path = require('path');
const app = express();
const port = 5000;

// Middleware para habilitar o uso de JSON no corpo das requisições e habilitar o CORS
app.use(express.json());
app.use(cors());

// Array para simular um banco de dados de carros
let carros = [];

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});

// Rota para servir arquivos estáticos (como o service worker e o manifesto)
app.use('/front-end', express.static(path.join(__dirname, '..', 'front-end')));

// Rota POST para cadastrar um novo carro (entrada)
app.post('/carros', (req, res) => {
  const { placa, modelo, servico } = req.body;
  const novoCarro = { placa, modelo, servico, status: 'em_lavagem' };
  carros.push(novoCarro);
  console.log(`Novo carro adicionado: ${JSON.stringify(novoCarro)}`);
  res.status(201).json(novoCarro);
});

// Rota GET para listar todos os carros
app.get('/carros', (req, res) => {
  res.json(carros);
});

// Rota PUT para marcar um carro como "concluído" (saída)
app.put('/carros/:placa', (req, res) => {
  const placa = req.params.placa;
  const carroEncontrado = carros.find(c => c.placa === placa);

  if (carroEncontrado) {
    carroEncontrado.status = 'concluido';
    console.log(`Carro com placa ${placa} marcado como concluído.`);
    res.json({ message: 'Carro concluído com sucesso!', carro: carroEncontrado });
  } else {
    res.status(404).json({ message: 'Carro não encontrado.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
