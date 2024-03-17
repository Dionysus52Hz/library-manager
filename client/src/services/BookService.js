import createApiClient from './ApiService';

class BookService {
   constructor(baseURL = '/v1/books') {
      this.API = createApiClient(baseURL);
   }

   async getAll() {
      return (await this.API.get('/')).data;
   }

   async create(data) {
      return (await this.API.post('/', data)).data;
   }

   async findOneById(id) {
      return (await this.API.get(`/${id}`)).data;
   }

   async findByFilter(filter) {
      return (
         await this.API.get('/', {
            params: {
               filter,
            },
         })
      ).data;
   }

   async updateOne(id, data) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async deleteOne(id) {
      return (await this.API.delete(`/${id}`)).data;
   }
}

export default new BookService();
