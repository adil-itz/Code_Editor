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
