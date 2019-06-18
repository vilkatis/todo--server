import { Inject, Service } from 'typedi';
import { ListsRepository } from '../repositories';
import { InternalServerError } from 'routing-controllers';
import { IListDAL } from '../models/interfaces';
import { Redis } from '../Redis';

@Service()
export class ListsService {
  @Inject() private _listsRepository: ListsRepository;
  @Inject() private _redis: Redis;

  async getLists(userId: string): Promise<IListDAL[]> {
    const key = `${userId}:lists`;
    let redisLists: string = await this._redis.getAsync(key);
    if (redisLists) return JSON.parse(redisLists);
    let lists: IListDAL[] = await this._listsRepository.find({userId});
    this._redis.set(key, JSON.stringify(lists));
    return lists;
  }

  async addList(name: string, userId: string): Promise<string> {
    try {
      return await this._listsRepository.create({name, userId});
    } catch (err) {
      throw new InternalServerError('Failed to add list to database.');
    }
  }
}
