const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importa o novo modelo de User

// Rota de cadastro de usuário (POST /api/users/cadastro)
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        const novoUser = new User({
            nome,
            email,
            senha,
            role
        });

        const userSalvo = await novoUser.save();
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', user: userSalvo });

    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.', erro: erro.message });
    }
});

// Rota de login de usuário (POST /api/users/login)
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        // Aviso de Segurança: Em um sistema real, use uma biblioteca como o bcrypt
        // para comparar senhas criptografadas, não texto simples.
        if (user.senha !== senha) {
            return res.status(401).json({ mensagem: 'Senha incorreta.' });
        }

        // Login bem-sucedido
        res.status(200).json({ mensagem: 'Login bem-sucedido!', token: 'seu_token_de_autenticacao', role: user.role });

    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: erro.message });
    }
});

module.exports = router;