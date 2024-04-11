import express from 'express';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

const START_SERVER = () => {
   const app = express();

   app.use(cookieParser());

   app.use(express.json());

   app.use('/v1', APIs_V1);

   app.use(errorHandlingMiddleware);

   app.use('/', (req, res) => {
      res.status(StatusCodes.OK).json({
         message: 'Hello.',
      });
   });

   app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
         `Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`
      );
   });

   exitHook(() => {
      console.log('Disconnecting from MongoDB...');
      CLOSE_DB();
      console.log('Disconnected from MongoDB...');
   });
};

(async () => {
   try {
      await CONNECT_DB();
      console.log('Connected to MongoDB successfully!');
      START_SERVER();
   } catch (error) {
      console.log(error);
      process.exit(0);
   }
})();
