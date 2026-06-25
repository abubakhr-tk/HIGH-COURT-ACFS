import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'kano-secret-key';
const expiresIn = '8h';

export const signToken = (payload: object) => jwt.sign(payload, secret, { expiresIn });

export const verifyToken = (token: string) => jwt.verify(token, secret) as any;
