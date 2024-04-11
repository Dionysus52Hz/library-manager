import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const generateAccessToken = (id, role) =>
   jwt.sign({ _id: id, role }, env.JWT_SECRET_KEY, { expiresIn: '3d' });

const generateRefreshToken = (id) =>
   jwt.sign({ _id: id }, env.JWT_SECRET_KEY, { expiresIn: '7d' });

export const jwtMiddleware = {
   generateAccessToken,
   generateRefreshToken,
};
