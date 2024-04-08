/* eslint-disable indent */
import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const BOOK_COLLECTION_NAME = 'books';
const CURRENT_YEAR = new Date().getFullYear();
const BOOK_COLLECTION_SCHEMA = Joi.object({
   title: Joi.string().max(256).trim().strict().required(),
   description: Joi.string().min(2).max(256).trim().strict().required(),
   bookId: Joi.string().min(7).max(20).default('').allow(''),
   slug: Joi.string().required().trim().strict(),
   topic: Joi.string().min(2).max(50).trim().strict().default('').allow(''),
   type: Joi.string().min(2).max(50).trim().strict().default('').allow(''),
   publisher: Joi.string().min(2).max(50).trim().strict().default('').allow(''),
   publishYear: Joi.number()
      .integer()
      .min(0)
      .max(CURRENT_YEAR)
      .default(null)
      .optional()
      .allow(null),
   author: Joi.string().min(1).max(256).trim().strict().default('').allow(''),
   createdAt: Joi.date().timestamp('javascript').default(Date.now),
   updatedAt: Joi.date().timestamp('javascript').default(null),
});

const validateBeforeCreate = async (data) => {
   return await BOOK_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
   });
};

const createNew = async (data) => {
   try {
      const validData = await validateBeforeCreate(data);
      // const bookIdIsExisted = await GET_DB()
      //    .collection(BOOK_COLLECTION_NAME)
      //    .findOne({ bookId: data.bookId });

      // if (!bookIdIsExisted) {
      //    return await GET_DB()
      //       .collection(BOOK_COLLECTION_NAME)
      //       .insertOne(validData);
      // } else console.log('book is existed');

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

const findByAnyKeywords = async (keyword) => {
   const keys = [
      'title',
      'author',
      'description',
      'topic',
      'publisher',
      'publishYear',
      'bookId',
   ];
   if (keyword === '') {
      return [];
   } else {
      const books = await findAll();

      return books.filter((book) => {
         return keys.some((key) => {
            return book[key] && book[key].toString().includes(keyword);
         });
      });
   }
};

const findByFilter = async (filter) => {
   try {
      switch (filter.filterSelected.filter) {
         case 'keyword':
            return findByAnyKeywords(filter.searchText);

         case 'title':
            return GET_DB()
               .collection(BOOK_COLLECTION_NAME)
               .find({
                  title: { $regex: new RegExp(filter.searchText, 'i') },
               })
               .toArray();

         case 'author':
            return GET_DB()
               .collection(BOOK_COLLECTION_NAME)
               .find({
                  author: { $regex: new RegExp(filter.searchText, 'i') },
               })
               .toArray();

         case 'publishYear':
            return GET_DB()
               .collection(BOOK_COLLECTION_NAME)
               .find({
                  publishYear: parseInt(filter.searchText),
               })
               .toArray();

         case 'bookId':
            return GET_DB()
               .collection(BOOK_COLLECTION_NAME)
               .find({
                  bookId: { $regex: new RegExp(filter.searchText, 'i') },
               })
               .toArray();

         default:
            return [];
      }
   } catch (error) {
      throw new Error(error);
   }
};

const findByFilters = async (filters) => {
   try {
      const query = filters.map((filter) => {
         const andFilters = filter.map((obj) => {
            let convertedObj = {};

            for (const key in obj) {
               if (key === 'publishYear') {
                  convertedObj[key] = parseInt(obj[key]);
               } else {
                  convertedObj[key] = { $regex: new RegExp(obj[key], 'i') };
               }
            }
            // console.log(convertedObj);
            return convertedObj;
         });
         return { $and: andFilters };
      });

      const finalQuery = { $or: query };

      return GET_DB()
         .collection(BOOK_COLLECTION_NAME)
         .find(finalQuery)
         .toArray();
   } catch (error) {
      throw new Error(error);
   }
};

const extractData = (payload) => {
   const result = {
      title: payload.title,
      description: payload.description,
      bookId: payload.bookId,
      slug: payload.slug,
      topic: payload.topic,
      type: payload.type,
      publisher: payload.publisher,
      publishYear:
         payload.publishYear === '' || payload.publishYear === null
            ? null
            : parseInt(payload.publishYear),
      author: payload.author,
      createdAt: payload.createdAt,
      updatedAt: Date.now(),
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
   findByFilters,
   updateOne,
   deleteOne,
};
