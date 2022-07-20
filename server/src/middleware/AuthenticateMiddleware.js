import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const Authenticate = async (req, res, next) => {
  const token =
    req.query.token || req.params.token || req.headers['x-auth-token'];

  await verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(400).json({ msg: 'Register or Login to upload video' });
    }
    req.token = decoded;
    next();
  });
};
