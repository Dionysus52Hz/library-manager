import createApiClient from './ApiService';

class UserService {
   constructor(baseURL = '/v1/users') {
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

   async updateOne(id, data) {
      return (await this.API.put(`/${id}`, data)).data;
   }

   async deleteOne(id) {
      return (await this.API.delete(`/${id}`)).data;
   }
}

export default new UserService();
