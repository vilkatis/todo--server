import { MongoDbRepository } from './MongoDbRepository';
import { IListDAL } from '../../models';
import { Service } from 'typedi';
import { Db } from 'mongodb';

@Service()
export class ListsRepository extends MongoDbRepository<IListDAL> {
  constructor(private db: Db) {
    super(db, 'lists');
  }
}
