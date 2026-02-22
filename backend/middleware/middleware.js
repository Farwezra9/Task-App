const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined');
}

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak tersedia' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau expired' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses khusus admin' });
  }
  next();
};

exports.isUser = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ message: 'Akses khusus user' });
  }
  next();
};