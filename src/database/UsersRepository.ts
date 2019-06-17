import { MongoDbRepository } from './MongoDbRepository';
import { IUserDAL } from '../models';
import { Service } from 'typedi';
import { Database } from './mongodb';

@Service()
export class UsersRepository extends MongoDbRepository<IUserDAL> {
  constructor(private database: Database) {
    super(database, 'users');
  }
}
