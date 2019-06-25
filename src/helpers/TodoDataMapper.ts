import 'reflect-metadata';
import { IList, IListDAL, ITask, ITaskDAL } from '../models';
import { ObjectId } from 'bson';

export class TodoDataMapper {
  static taskToDalEntity(entity: ITask): ITaskDAL {
    return {
      _id: new ObjectId(entity.id),
      isCompleted: entity.isCompleted,
      name: entity.name
    };
  }

  static taskToEntity(dalEntity: ITaskDAL): ITask {
    return {
      id: dalEntity._id.toHexString(),
      isCompleted: dalEntity.isCompleted,
      name: dalEntity.name
    };
  }

  static listToDalEntity(entity: IList): IListDAL {
    throw new Error('Not implemented');
  }

  static listToEntity(dalEntity: IListDAL): IList {
    let tasks: Record<string, ITask>;
    let count: number;
    if (dalEntity.tasks) {
      const taskKeys = Object.keys(dalEntity.tasks);
      tasks = taskKeys.reduce((dictionary: Record<string, ITask>, key: string) => {
        dictionary[key] = TodoDataMapper.taskToEntity(dalEntity.tasks[key]);
        return dictionary;
      }, {});
      count = taskKeys.length;
    }
    return {
      id: dalEntity._id.toHexString(),
      name: dalEntity.name,
      count,
      tasks
    };
  }

}
