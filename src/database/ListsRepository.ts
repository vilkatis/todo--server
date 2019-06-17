import { MongoDbRepository } from './MongoDbRepository';
import { IListDAL } from '../models';
import { Service } from 'typedi';
import { Database } from './mongodb';

@Service()
export class ListsRepository extends MongoDbRepository<IListDAL> {
  constructor(private database: Database) {
    super(database, 'lists');
  }
}
