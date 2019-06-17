import { Inject, Service } from 'typedi';
import { ListsRepository } from '../database';
import { InternalServerError } from 'routing-controllers';
import { IListDAL } from '../models/interfaces';

@Service()
export class ListsService {
  @Inject() listsRepository: ListsRepository;

  async getLists(userId: string): Promise<IListDAL> {
    return this.listsRepository.findOne({userId});
  }

  async addList(name: string, userId: string): Promise<string> {
    try {
      return await this.listsRepository.create({name, userId});
    } catch (err) {
      throw new InternalServerError('Failed to add list to database.');
    }
  }
}
