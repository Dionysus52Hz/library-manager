import express from 'express';
import { bookValidation } from '~/validations/bookValidation';
import { bookController } from '~/controllers/bookController';

const Router = express.Router();

Router.route('/')
   .get(bookController.findAll)
   .post(bookValidation.createNew, bookController.createNew);

Router.route('/:id')
   .get(bookController.findOneById)
   .put(bookValidation.updateOne, bookController.updateOne)
   .delete(bookController.deleteOne);

export const bookRoute = Router;
