const User = require('../models/firebase/User');
const jwt = require('jsonwebtoken');

/**
 * Registra um novo usuário
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }
    
    // Criar novo usuário
    const userData = {
      name,
      email,
      password,
      role: role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const user = await User.create(userData);
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

/**
 * Autentica um usuário
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Autenticar usuário
    const user = await User.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

/**
 * Obtém o perfil do usuário autenticado
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil', error: error.message });
  }
};

/**
 * Atualiza a senha do usuário
 */
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    // Verificar se o usuário existe e se a senha atual está correta
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Autenticar usuário com a senha atual
    const authenticatedUser = await User.authenticate(user.email, currentPassword);
    
    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    // Atualizar senha
    const updateData = {
      password: newPassword,
      updatedAt: new Date()
    };
    
    await User.update(userId, updateData);
    
    res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ message: 'Erro ao atualizar senha', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updatePassword
};