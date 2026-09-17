import jwt from 'jsonwebtoken';
import { findUserById } from '../db/userStore.js';

export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devspace_super_secret_jwt_key_2026_x89f');
      const user = await findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User no longer exists.' });
      }

      const { password, ...userWithoutPassword } = user;
      userWithoutPassword.role = userWithoutPassword.role || (userWithoutPassword.email?.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'user');
      userWithoutPassword.id = user.id || user._id?.toString();
      req.user = userWithoutPassword;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required.' });
}

