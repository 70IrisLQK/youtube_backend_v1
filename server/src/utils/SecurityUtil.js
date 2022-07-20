import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const TOKEN_SECRET = process.env.TOKEN_SECRET

export const createToken = async (payload) => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '10d' })
}
