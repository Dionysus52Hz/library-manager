import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { bookRoute } from '~/routes/v1/bookRoute';
import { userRoute } from '~/routes/v1/userRoute';

const Router = express.Router();

Router.get('/status', (req, res) => {
   res.status(StatusCodes.OK).json({
      message: 'APIs V1 are ready to use.',
      code: StatusCodes.OK,
   });
});

Router.use('/books', bookRoute);
Router.use('/users', userRoute);

export const APIs_V1 = Router;
