import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   const correctCondition = Joi.object({
      bookId: Joi.string().max(256),
      title: Joi.string().required().min(1).max(100).trim().strict(),
      description: Joi.string().required().min(3).max(256).trim().strict(),
      topic: Joi.string().max(256).trim().strict(),
      type: Joi.string().max(256).trim().strict(),
      publisher: Joi.string().max(256).trim().strict(),
      publishedAt: Joi.string().max(4).trim().strict(),
      author: Joi.string().min(0).max(256).trim().strict(),
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

const updateOne = async (req, res, next) => {
   const correctCondition = Joi.object({
      _id: Joi.string().min(0),
      title: Joi.string().required().min(3).max(50).trim().strict(),
      description: Joi.string().required().min(3).max(255).trim().strict(),
      slug: Joi.string(),
      bookId: Joi.string().min(0).max(256).trim().strict(),
      topic: Joi.string().min(0).max(256).trim().strict(),
      type: Joi.string().min(0).max(256).trim().strict(),
      publisher: Joi.string().min(0).max(256).trim().strict(),
      publishedAt: Joi.string().min(0).max(4).trim().strict(),
      author: Joi.optional(),
      createdAt: Joi.optional(),
      updateAt: Joi.optional(),
      _destroy: Joi.boolean(),
   });

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
