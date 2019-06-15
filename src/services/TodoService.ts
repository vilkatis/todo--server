import { Inject, Service } from 'typedi';
import { Database } from '../database';
import { InternalServerError } from 'routing-controllers';

@Service()
export class UserService {
  @Inject() database: Database;

  async getLists(userId: string): Promise<any> {
    const listCollection = this.database.getCollection('lists');
    return listCollection.find({userId});
  }

  async addList(name: string, userId: string): Promise<boolean> {
    const listCollection = this.database.getCollection('lists');
    try {
      await listCollection.insertOne({name, userId});
      return true;
    } catch(err) {
      throw new InternalServerError('Failed to add list to database.');
    }
  }
}
