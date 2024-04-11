import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
   userId: Joi.string().pattern(new RegExp('^[B][0-9]{7}$')).required(),
   password: Joi.string().required().trim().strict().default(''),
   username: Joi.string().max(50).trim().strict().default(''),
   email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'vn'] },
   }),
   role: Joi.string().default('user'),
   slug: Joi.string().trim().strict().allow(''),
   gender: Joi.number().integer().valid(0, 1),
   birthday: Joi.date().timestamp('javascript').default(null),
   faculty: Joi.string().min(0).max(255).trim().strict().default(''),
   class: Joi.string().max(8).trim().strict().default(''),
   favoriteBooks: Joi.array().items(Joi.object()),
   refreshToken: Joi.string().default(''),
   passwordChangedAt: Joi.date().timestamp('javascript').default(null),
   passwordResetToken: Joi.string().default(null),
   passwordResetExpires: Joi.date().timestamp('javascript').default(null),
   isBlocked: Joi.boolean().default(false),
   createdAt: Joi.date().timestamp('javascript').default(Date.now),
   updatedAt: Joi.date().timestamp('javascript').default(null),
});

const validateBeforeCreate = async (data) => {
   return await USER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
   });
};

const createNew = async (data) => {
   try {
      const validData = await validateBeforeCreate(data);

      const user = await GET_DB()
         .collection(USER_COLLECTION_NAME)
         .find({
            $or: [
               {
                  userId: validData.userId,
               },
               {
                  email: validData.email,
               },
            ],
         })
         .toArray();

      if (user.length > 0) {
         throw new Error('User is existed!');
      }

      const hashPassword = await bcrypt.hash(validData.password, 10);
      validData.password = hashPassword;

      return await GET_DB()
         .collection(USER_COLLECTION_NAME)
         .insertOne(validData);
   } catch (error) {
      throw new Error(error);
   }
};

const findAll = async () => {
   try {
      return GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray();
   } catch (error) {
      throw new Error(error);
   }
};

const findOneById = async (id) => {
   try {
      return GET_DB()
         .collection(USER_COLLECTION_NAME)
         .findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
         });
   } catch (error) {
      throw new Error(error);
   }
};

const isCorrectPassword = async (reqBody) => {
   try {
      const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
         userId: reqBody.userId,
      });

      const checkPassword = await bcrypt.compare(
         reqBody.password,
         user.password
      );

      if (checkPassword) {
         return user;
      } else return null;
   } catch (error) {
      throw new Error(error);
   }
};

const extractData = (payload) => {
   const result = {
      userId: payload.userId,
      password: payload.password,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      slug: payload.slug,
      gender: payload.gender,
      birthday: payload.birthday,
      faculty: payload.faculty,
      class: payload.class,
      favoriteBooks: payload.favoriteBooks,
      refreshToken: payload.refreshToken,
      passwordChangedAt: payload.passwordChangedAt,
      passwordResetToken: payload.passwordResetToken,
      passwordResetExpires: payload.passwordResetExpires,
      isBlocked: payload.isBlocked,
      createdAt: payload.createdAt,
      updatedAt: Date.now(),
   };
   return result;
};

const updateOne = async (id, data) => {
   try {
      const user = extractData(data);

      return GET_DB()
         .collection(USER_COLLECTION_NAME)
         .findOneAndUpdate(
            {
               _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            },
            { $set: user },
            { returnDocument: 'after' }
         );
   } catch (error) {
      throw new Error(error);
   }
};

const findByIdAndUpdate = async (id, data) => {
   try {
      return GET_DB()
         .collection(USER_COLLECTION_NAME)
         .findOneAndUpdate(
            {
               _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            },
            { $set: data },
            { returnNewDocument: true }
         );
   } catch (error) {
      throw new Error(error);
   }
};

const deleteOne = async (id) => {
   try {
      return GET_DB()
         .collection(USER_COLLECTION_NAME)
         .deleteOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
         });
   } catch (error) {
      throw new Error(error);
   }
};

export const userModel = {
   USER_COLLECTION_NAME,
   USER_COLLECTION_SCHEMA,
   createNew,
   findAll,
   findOneById,
   findByIdAndUpdate,
   isCorrectPassword,
   updateOne,
   deleteOne,
};
