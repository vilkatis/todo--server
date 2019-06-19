import { MongoDbRepository } from './MongoDbRepository';
import { IUserDAL } from '../../models';
import { Service } from 'typedi';
import { Db } from 'mongodb';

@Service()
export class UsersRepository extends MongoDbRepository<IUserDAL> {
  constructor(private db: Db) {
    super(db, 'users');
  }
}
