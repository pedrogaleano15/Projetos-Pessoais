const mongoose = require('mongoose');

// Define o esquema para o usuário, que agora inclui a função (role)
const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['comprador', 'vendedor'], // O campo só pode ter um desses dois valores
        default: 'comprador'
    }
});

// Cria o modelo 'User' a partir do esquema
const User = mongoose.model('User', userSchema);

module.exports = User;