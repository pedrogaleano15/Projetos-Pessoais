const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Importa as rotas de usuário (alterado de vendedorRoutes)
const userRoutes = require('./routes/userRoutes');

// URL de conexão do seu MongoDB Atlas
const mongoURI = 'mongodb+srv://pedrogaleanomorais_db_user:pedro@cluster0.9kzbdbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Conexão com o banco de dados
mongoose.connect(mongoURI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar com o MongoDB:', err));

// Configurações do Express para servir arquivos estáticos e processar dados
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Adiciona as rotas de usuário ao servidor (o caminho e o import mudaram)
app.use('/api/users', userRoutes);

// ... código de rotas de produtos ...
const produtos = [
    { id: 1, nome: 'Chaleira', preco: 50.00, emEstoque: 10 },
    { id: 2, nome: 'Batata', preco: 5.00, emEstoque: 50 },
];

app.get('/api/produtos', (req, res) => {
    res.json(produtos);
});

app.post('/api/produtos', (req, res) => {
    const novoProduto = req.body;
    novoProduto.id = produtos.length + 1;
    produtos.push(novoProduto);
    res.status(201).json({ mensagem: "Produto adicionado com sucesso!", produto: novoProduto });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});