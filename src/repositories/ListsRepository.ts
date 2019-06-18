import { MongoDbRepository } from './MongoDbRepository';
import { IListDAL } from '../models';
import { Service } from 'typedi';

@Service()
export class ListsRepository extends MongoDbRepository<IListDAL> {
  constructor() {
    super('lists');
  }
}
