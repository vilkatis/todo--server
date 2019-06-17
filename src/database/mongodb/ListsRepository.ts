import { MongoDbRepository } from './MongoDbRepository';
import { IListDAL } from '../../models';
import { Service } from 'typedi';
import { MongoDb } from './MongoDb';

@Service()
export class ListsRepository extends MongoDbRepository<IListDAL> {
  constructor(private _database: MongoDb) {
    super(_database, 'lists');
  }
}
