import { Inject, Service } from 'typedi';
import { ListsRepository } from '../repositories';
import { InternalServerError } from 'routing-controllers';
import { IListDAL } from '../models/interfaces';
import { Redis } from '../Redis';
import { ObjectId } from 'bson';

@Service()
export class ListsService {
  @Inject() private _listsRepository: ListsRepository;
  @Inject() private _redis: Redis;

  async getLists(userId: string): Promise<IListDAL[]> {
    const key = `${userId}:lists`;
    let redisLists: string = await this._redis.getAsync(key);
    if (redisLists) return JSON.parse(redisLists);
    const lists: IListDAL[] = await this._listsRepository.find({userId});
    this._redis.set(key, JSON.stringify(lists));
    return lists;
  }

  async createList(name: string, userId: string): Promise<string> {
    const key = `${userId}:lists`;
    try {
      const listId: string = await this._listsRepository.create({name, userId});
      await this._redis.delAsync(key);
      return listId;
    } catch (err) {
      throw new InternalServerError('Failed to add list to database.');
    }
  }

  async updateList(userId: string, listId: string, name: string): Promise<boolean> {
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {$set: {name}});
    await this._redis.delAsync(key);
    return result;
  }

  async addTask(listId: string, userId: string, taskName: string): Promise<boolean> {
    const dbKey: string = `tasks.${new ObjectId().toHexString()}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $set: {
        [dbKey]: {
          name: taskName,
          isCompleted: false
        }
      }
    });
    await this._redis.delAsync(key);
    return result;
  }

  async updateTask(listId: string, userId: string, task: any): Promise<boolean> {
    const dbKey = `tasks.${task._id}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $set: {
        [dbKey]: {
          name: task.name,
          isCompleted: task.isCompleted
        }
      }
    });
    await this._redis.delAsync(key);
    return result;
  }

  async deleteTask(userId: string, listId: string, taskId: string): Promise<boolean> {
    const dbKey = `tasks.${taskId}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $unset: {
        [dbKey]: 1
      }
    });
    await this._redis.delAsync(key);
    return result;
  }
}
