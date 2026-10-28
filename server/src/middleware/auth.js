import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  const roleHeader = req.headers['x-role'];

  // Helper to fetch fallback/direct access user
  const getDirectUser = async (targetRole = 'hr') => {
    return (
      (await User.findOne({ role: targetRole, status: 'active' }).lean()) ||
      (await User.findOne({ status: 'active' }).lean()) ||
      (await User.findOne().lean())
    );
  };

  // 1. Direct role override via header if requested
  if (roleHeader) {
    const directUser = await getDirectUser(roleHeader);
    if (directUser) {
      req.user = directUser;
      return next();
    }
  }

  // 2. If token is provided, verify it
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = await User.findById(payload.sub).lean();
      if (user && user.status === 'active') {
        req.user = user;
        return next();
      }
    } catch {
      // Fall through to direct access fallback
    }
  }

  // 3. Direct Access Fallback: attach default active user so no auth is required
  const directUser = await getDirectUser('hr');
  if (directUser) {
    req.user = directUser;
    return next();
  }

  throw ApiError.unauthorized('No user available in database');
}
