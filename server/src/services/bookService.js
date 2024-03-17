import { slugify } from '~/utils/formatter';
import { bookModel } from '~/models/bookModel';

const findAll = async () => {
   try {
      const books = await bookModel.findAll();
      return books;
   } catch (error) {
      throw new Error(error);
   }
};

const createNew = async (reqBody) => {
   try {
      const newBook = {
         ...reqBody,
         slug: slugify(reqBody.title),
      };

      const createdBook = await bookModel.createNew(newBook);

      const getNewBook = await bookModel.findOneById(createdBook.insertedId);

      console.log(getNewBook);

      // Service must have return
      return getNewBook;
   } catch (error) {
      throw new Error(error);
   }
};

const findOneById = async (id) => {
   try {
      const result = await bookModel.findOneById(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const findByFilter = async (filter) => {
   try {
      const result = await bookModel.findByFilter(filter);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const updateOne = async (id, data) => {
   try {
      data.slug = slugify(data.title);
      const result = await bookModel.updateOne(id, data);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

const deleteOne = async (id) => {
   try {
      const result = await bookModel.deleteOne(id);
      return result;
   } catch (error) {
      throw new Error(error);
   }
};

export const bookService = {
   createNew,
   findAll,
   findOneById,
   findByFilter,
   updateOne,
   deleteOne,
};
