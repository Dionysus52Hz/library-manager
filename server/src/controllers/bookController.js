import { StatusCodes } from 'http-status-codes';
import { bookService } from '~/services/bookService';
import ApiError from '~/utils/ApiError';

const createNew = async (req, res, next) => {
   try {
      const createBook = await bookService.createNew(req.body);

      res.status(StatusCodes.CREATED).json(createBook);
   } catch (error) {
      next(error);
   }
};

const findAll = async (req, res, next) => {
   try {
      const filter = req.query.filter;
      if (filter) {
         const books = await bookService.findByFilter(filter);
         res.status(StatusCodes.OK).json(books);
      } else {
         const books = await bookService.findAll();
         res.status(StatusCodes.OK).json(books);
      }
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while retrieving books.'
         )
      );
   }
};

const findOneById = async (req, res, next) => {
   try {
      const result = await bookService.findOneById(req.params.id);

      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while retrieving book by id.'
         )
      );
   }
};

const updateOne = async (req, res, next) => {
   try {
      const result = await bookService.updateOne(req.params.id, req.body);
      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while updating book by id.'
         )
      );
   }
};

const deleteOne = async (req, res, next) => {
   try {
      const result = await bookService.deleteOne(req.params.id);
      res.status(StatusCodes.OK).json(result);
   } catch (error) {
      return next(
         new ApiError(
            StatusCodes.BAD_REQUEST,
            'An error occurred while deleting book by id.'
         )
      );
   }
};

export const bookController = {
   createNew,
   findAll,
   findOneById,
   updateOne,
   deleteOne,
};
