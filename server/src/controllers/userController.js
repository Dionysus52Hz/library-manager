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

const login = async (req, res, next) => {
   try {
      const { userData, accessToken, refreshToken } = await userService.login(
         req.body
      );

      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json({
         userData,
         accessToken,
      });
   } catch (error) {
      return next(
         new ApiError(StatusCodes.BAD_REQUEST, 'An error occurred while login.')
      );
   }
};

const getCurrent = async (req, res, next) => {
   try {
      const { _id } = req.user;
      const { password, role, refreshToken, ...userData } =
         await userService.findOneById(_id);
      res.status(StatusCodes.OK).json({
         result: userData ? userData : 'User not found',
      });
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while retrieving current user.'
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
   login,
   getCurrent,
};
