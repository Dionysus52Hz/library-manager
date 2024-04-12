import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const verifyAccessToken = async (req, res, next) => {
   if (req?.headers?.authorization?.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];

      jwt.verify(token, env.JWT_SECRET_KEY, (error, decode) => {
         if (error) {
            return res.status(401).json({
               message: 'Invalid access token!',
            });
         }
         req.user = decode;
         next();
      });
   } else {
      return res.status(401).json({
         message: 'Require authentication!',
      });
   }
};

export const verifyToken = {
   verifyAccessToken,
};
