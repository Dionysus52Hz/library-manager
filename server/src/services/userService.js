import { slugify } from '~/utils/formatter';
import { userModel } from '~/models/userModel';

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
      const newBook = {
         ...reqBody,
         slug: slugify(reqBody.username),
      };

      const createdBook = await userModel.createNew(newBook);

      const getNewBook = await userModel.findOneById(createdBook.insertedId);

      console.log(getNewBook);

      // Service must have return
      return getNewBook;
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
      data.slug = slugify(data.title);
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

export const userService = {
   createNew,
   findAll,
   findOneById,
   updateOne,
   deleteOne,
};
