import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   const correctCondition = Joi.object({
      userId: Joi.string().pattern(new RegExp('^[B][0-9]{7}$')).required(),
      password: Joi.string().required().min(8).max(255).trim().strict(),
      username: Joi.string().max(255).trim().strict(),
      email: Joi.string().email({
         minDomainSegments: 2,
         tlds: { allow: ['com', 'vn'] },
      }),
      gender: Joi.number().integer().valid(0, 1),
      faculty: Joi.string().min(0).max(255).trim().strict(),
      class: Joi.string().max(8).trim().strict(),
   });

   try {
      await correctCondition.validateAsync(req.body, {
         abortEarly: false,
      });

      next();
   } catch (error) {
      const errorMessage = new Error(error).message;
      const customError = new ApiError(
         StatusCodes.UNPROCESSABLE_ENTITY,
         errorMessage
      );
      next(customError);
   }
};

export const userValidation = {
   createNew,
};
