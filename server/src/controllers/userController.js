import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createBook = await userService.createNew(req.body);

      res.status(StatusCodes.CREATED).json(createBook);
   } catch (error) {
      next(error);
   }
};

const findAll = async (req, res, next) => {
   try {
      const users = await userService.findAll();
      res.status(StatusCodes.OK).json(users);
   } catch (error) {
      console.log(error);
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while retrieving users.'
         )
      );
   }
};

const findOneById = async (req, res, next) => {
   try {
      const result = await userService.findOneById(req.params.id);

      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while retrieving user by id.'
         )
      );
   }
};

const updateOne = async (req, res, next) => {
   try {
      const result = await userService.updateOne(req.params.id, req.body);
      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while updating user by id.'
         )
      );
   }
};

const deleteOne = async (req, res, next) => {
   try {
      const result = await userService.deleteOne(req.params.id);
      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while deleting user by id.'
         )
      );
   }
};

export const userController = {
   createNew,
   findAll,
   findOneById,
   updateOne,
   deleteOne,
};
