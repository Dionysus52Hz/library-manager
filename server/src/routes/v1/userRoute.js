import express from 'express';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const Router = express.Router();

Router.route('/')
   .get(userController.findAll)
   .post(userValidation.createNew, userController.createNew);

Router.route('/current').get(
   verifyToken.verifyAccessToken,
   userController.getCurrent
);

Router.route('/logout').get(userController.logout);

Router.route('/:id')
   .get(userController.findOneById)
   .put(userController.updateOne)
   .delete(userController.deleteOne);

Router.route('/login').post(userController.login);

Router.route('/create-new-access-token').post(
   userController.createNewAccessToken
);

export const userRoute = Router;
