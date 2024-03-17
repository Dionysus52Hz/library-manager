import express from 'express';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.route('/')
   .get(userController.findAll)
   .post(userValidation.createNew, userController.createNew);

Router.route('/:id')
   .get(userController.findOneById)
   .put(userValidation.updateOne, userController.updateOne)
   .delete(userController.deleteOne);

export const userRoute = Router;
