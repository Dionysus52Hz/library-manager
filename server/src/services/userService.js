import slugify from 'slugify';
import { userModel } from '~/models/userModel';
import { jwtMiddleware } from '~/middlewares/jwt';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const findAll = async () => {
   try {
      const users = await userModel.findAll();
      return users;
   } catch (error) {
      throw new Error(error);
   }
};

const createNew = async (reqBody) => {
   try {
      const newUser = {
         ...reqBody,
         slug: reqBody.username
            ? slugify(reqBody.username, {
                 locale: 'vi',
                 lower: true,
              })
            : '',
      };

      const createdUser = await userModel.createNew(newUser);

      const getNewUser = await userModel.findOneById(createdUser.insertedId);

      console.log(getNewUser);

      // Service must have return
      return getNewUser;
   } catch (error) {
      throw new Error(error);
   }
};

const findOneById = async (id) => {
   try {
      const result = await userModel.findOneById(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const updateOne = async (id, data) => {
   try {
      data.slug = slugify(data.username, {
         locale: 'vi',
         lower: true,
      });
      const result = await userModel.updateOne(id, data);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteOne = async (id) => {
   try {
      const result = await userModel.deleteOne(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const login = async (reqBody) => {
   try {
      const userData = await userModel.isCorrectPassword(reqBody);
      const accessToken = jwtMiddleware.generateAccessToken(
         userData._id,
         userData.role
      );
      const refreshToken = jwtMiddleware.generateRefreshToken(userData._id);

      const result = await userModel.findByIdAndUpdate(userData._id, {
         refreshToken: refreshToken,
      });

      return {
         userData: result,
         accessToken,
      };
   } catch (error) {
      throw new Error(error);
   }
};

const createNewAccessToken = async (refreshToken) => {
   try {
      const verified = jwt.verify(refreshToken, env.JWT_SECRET_KEY);

      const result = await userModel.findOne({
         _id: verified._id,
         refreshToken: refreshToken,
      });

      const newAccessToken = result
         ? jwtMiddleware.generateAccessToken(result._id, result.role)
         : 'Invalid refresh token';

      return newAccessToken;
   } catch (error) {
      throw new Error(error);
   }
};

const logout = async (refreshToken) => {
   try {
      await userModel.findOneAndUpdate(
         {
            refreshToken,
         },
         { refreshToken: '' }
      );
   } catch (error) {
      throw new Error(error);
   }
};

export const userService = {
   createNew,
   findAll,
   findOneById,
   updateOne,
   deleteOne,
   login,
   logout,
   createNewAccessToken,
};
