import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
   userId: Joi.string().pattern(new RegExp('^[A-Z][0-9]{7}$')).required(),
   password: Joi.string()
      .required()
      .min(8)
      .max(255)
      .trim()
      .strict()
      .default(''),

   username: Joi.string().required().min(2).max(50).trim().strict(),
   slug: Joi.string().required().min(3).trim().strict(),
   gender: Joi.number().integer().valid(0, 1).required(),
   birthday: Joi.date().timestamp('javascript').default(null),
   faculty: Joi.string().min(0).max(255).trim().strict().default(''),
   class: Joi.string().max(8).trim().strict().default(''),
   createdAt: Joi.date().timestamp('javascript').default(Date.now),
   updateAt: Joi.date().timestamp('javascript').default(null),
   _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
   return await USER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
   });
};

const createNew = async (data) => {
   try {
      const validData = await validateBeforeCreate(data);
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

const extractData = (payload) => {
   const result = {
      bookId: payload.bookId,
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      topic: payload.topic,
      type: payload.type,
      publisher: payload.publisher,
      publishedAt: payload.publishedAt,
      author: payload.author,
      createdAt: payload.createdAt,
      updateAt: Date.now(),
      _destroy: payload._destroy,
   };
   return result;
};

const updateOne = async (id, data) => {
   try {
      const book = extractData(data);

      return GET_DB()
         .collection(USER_COLLECTION_NAME)
         .findOneAndUpdate(
            {
               _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            },
            { $set: book },
            { returnDocument: 'after' }
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
   updateOne,
   deleteOne,
};
