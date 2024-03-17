import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const BOOK_COLLECTION_NAME = 'books';
const BOOK_COLLECTION_SCHEMA = Joi.object({
   bookId: Joi.string().min(0).max(256).default(''),
   title: Joi.string().required().min(1).max(100).trim().strict(),
   slug: Joi.string().required().min(1).trim().strict(),
   description: Joi.string().required().min(3).max(255).trim().strict(),
   topic: Joi.string().max(256).trim().strict().default(''),
   type: Joi.string().max(256).trim().strict().default(''),
   publisher: Joi.string().max(256).trim().strict().default(''),
   publishedAt: Joi.string().max(4).trim().strict().default(''),
   author: Joi.string().min(0).max(256).trim().strict().default(''),
   createdAt: Joi.date().timestamp('javascript').default(Date.now),
   updateAt: Joi.date().timestamp('javascript').default(null),
   _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
   return await BOOK_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
   });
};

const createNew = async (data) => {
   try {
      const validData = await validateBeforeCreate(data);
      return await GET_DB()
         .collection(BOOK_COLLECTION_NAME)
         .insertOne(validData);
   } catch (error) {
      throw new Error(error);
   }
};

const findAll = async () => {
   try {
      return GET_DB().collection(BOOK_COLLECTION_NAME).find({}).toArray();
   } catch (error) {
      throw new Error(error);
   }
};

const findOneById = async (id) => {
   try {
      return GET_DB()
         .collection(BOOK_COLLECTION_NAME)
         .findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
         });
   } catch (error) {
      throw new Error(error);
   }
};

const findByFilter = async (filter) => {
   try {
      return GET_DB()
         .collection(BOOK_COLLECTION_NAME)
         .find({
            title: { $regex: new RegExp(filter.searchText, 'i') },
         })
         .toArray();
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
         .collection(BOOK_COLLECTION_NAME)
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
         .collection(BOOK_COLLECTION_NAME)
         .deleteOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
         });
   } catch (error) {
      throw new Error(error);
   }
};

export const bookModel = {
   BOOK_COLLECTION_NAME,
   BOOK_COLLECTION_SCHEMA,
   createNew,
   findAll,
   findOneById,
   findByFilter,
   updateOne,
   deleteOne,
};
