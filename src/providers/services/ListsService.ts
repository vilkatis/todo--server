import { Inject, Service } from 'typedi';
import { ListsRepository } from '../repositories';
import { InternalServerError } from 'routing-controllers';
import { IList, IListDAL, ITask } from '../../models';
import { RedisService } from './RedisService';
import { ObjectId } from 'bson';
import { ListDataMapper } from '../data-mappers';

@Service()
export class ListsService {
  @Inject() private _listsRepository: ListsRepository;
  @Inject() private _dataMapper: ListDataMapper;
  @Inject() private _redis: RedisService;

  async getLists(userId: string): Promise<IList[]> {
    const key = `${userId}:lists`;
    let redisLists: string = await this._redis.getAsync(key);
    if (redisLists) return JSON.parse(redisLists);
    const listsDAL: IListDAL[] = await this._listsRepository.find({userId});
    const lists: IList[] = listsDAL.map(this._dataMapper.toEntity);
    await this._redis.setAsync(key, JSON.stringify(lists));
    return lists;
  }

  async createList(userId: string, name: string): Promise<string> {
    const key = `${userId}:lists`;
    try {
      const listId: string = await this._listsRepository.create({name, userId});
      await this._redis.delAsync(key);
      return listId;
    } catch (err) {
      throw new InternalServerError('Failed to create list.');
    }
  }

  async updateList(userId: string, list: IList): Promise<boolean> {
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(list.id, {$set: {name : list.name}});
    await this._redis.delAsync(key);
    return result;
  }

  async addTask(listId: string, userId: string, taskName: string): Promise<string> {
    const _id: ObjectId = new ObjectId();
    const dbKey: string = `tasks.${_id.toHexString()}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $set: {
        [dbKey]: {
          _id,
          name: taskName,
          isCompleted: false
        }
      }
    });
    if (result) {
      await this._redis.delAsync(key);
      return _id.toHexString();
    } else {
      throw new InternalServerError('Failed to add task..');
    }
  }

  async updateTask(listId: string, userId: string, task: ITask): Promise<boolean> {
    const dbKey = `tasks.${task.id}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $set: {
        [dbKey]: {
          name: task.name,
          isCompleted: task.isCompleted
        }
      }
    });
    if (result) {
      await this._redis.delAsync(key);
      return result;
    } else {
      throw new InternalServerError('Failed to update task.');
    }
  }

  async deleteTask(userId: string, listId: string, taskId: string): Promise<boolean> {
    const dbKey = `tasks.${taskId}`;
    const key = `${userId}:lists`;
    const result: boolean = await this._listsRepository.updateOne(listId, {
      $unset: {
        [dbKey]: 1
      }
    });
    if (result) {
      await this._redis.delAsync(key);
      return result;
    } else {
      throw new InternalServerError('Failed to delete task.');
    }
  }
}
