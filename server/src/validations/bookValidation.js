import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { CURRENT_YEAR } from '~/utils/constants';

const correctCondition = Joi.object({
   _id: Joi.string(),
   title: Joi.string().max(256).trim().strict().required(),
   description: Joi.string().min(2).max(256).trim().strict().required(),
   bookId: Joi.string().min(7).max(20).allow(''),
   slug: Joi.string(),
   topic: Joi.string().min(2).max(50).trim().strict().allow(''),
   type: Joi.string().min(2).max(50).trim().strict().allow(''),
   publisher: Joi.string().min(2).max(50).trim().strict().allow(''),
   publishYear: Joi.number()
      .integer()
      .min(0)
      .max(CURRENT_YEAR)
      .allow(null)
      .allow(''),
   author: Joi.string().min(1).max(256).trim().strict().allow(''),
   createdAt: Joi.optional(),
   updatedAt: Joi.optional(),
});

const createNew = async (req, res, next) => {
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

const updateOne = async (req, res, next) => {
   try {
      await correctCondition.validateAsync(req.body, {
         abortEarly: false,
      });

      next();
   } catch (error) {
      console.log(error);
      const errorMessage = new Error(error).message;
      const customError = new ApiError(
         StatusCodes.UNPROCESSABLE_ENTITY,
         errorMessage
      );
      next(customError);
   }
};
export const bookValidation = {
   createNew,
   updateOne,
};
