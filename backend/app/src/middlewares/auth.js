const jwt = require('jsonwebtoken');
const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const json = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    console.log("Decoded JWT:", json);
    const payload = jwt.verify(json.access_token, SUPABASE_JWT_SECRET);
    console.log("Decoded JWT payload:", payload);

    const { data } = await axios.get(
      `${SUPABASE_URL}/rest/v1/users?select=role&id=eq.${payload.sub}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!data || data.length === 0) {
      return res.status(403).json({ message: 'User not found or unauthorized' });
    }

    req.user = {
      id: payload.sub,
      role: data[0].role,
    };

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid or malformed token' });
  }
}

module.exports = authMiddleware;