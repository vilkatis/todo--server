import { MongoDbRepository } from './MongoDbRepository';
import { IUserDAL } from '../models';
import { Service } from 'typedi';

@Service()
export class UsersRepository extends MongoDbRepository<IUserDAL> {
  constructor() {
    super('users');
  }
}
