import { MongoDbRepository } from './MongoDbRepository';
import { IUserDAL } from '../../models';
import { Service } from 'typedi';
import { MongoDb } from './MongoDb';

@Service()
export class UsersRepository extends MongoDbRepository<IUserDAL> {
  constructor(private _database: MongoDb) {
    super(_database, 'users');
  }
}
