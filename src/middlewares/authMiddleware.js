const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar se o usuário está autenticado
 */
const authenticate = (req, res, next) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar informações do usuário ao objeto de requisição
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Acesso não autorizado. Token inválido' });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de administrador
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária' });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de coordenador ou administrador
 */
const isCoordinatorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'coordinator' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Acesso negado. Permissão de coordenador ou administrador necessária' });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isCoordinatorOrAdmin
};