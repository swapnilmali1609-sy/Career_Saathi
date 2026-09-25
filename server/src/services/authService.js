import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'development-only-jwt-secret-key-392183';
const DEFAULT_SECRET = 'prepai_super_secret_jwt_key_2026';

const getSecret = () => process.env.JWT_SECRET || DEFAULT_SECRET;

export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const issueToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'USER'
    },
    getSecret(),
    { expiresIn: '7d' }
  );
};

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token required.' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    
    // Verify against current secret or fallback secrets for seamless development persistence
    const secretsToTry = [
      getSecret(),
      DEFAULT_SECRET,
      DEV_FALLBACK_SECRET
    ].filter((s, idx, arr) => arr.indexOf(s) === idx);

    let decoded = null;
    let lastErr = null;

    for (const secret of secretsToTry) {
      try {
        decoded = jwt.verify(token, secret);
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!decoded) {
      throw lastErr;
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication session. Please sign in again.' });
  }
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient role permissions.' });
    }
    next();
  };
};
