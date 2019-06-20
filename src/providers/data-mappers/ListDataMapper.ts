import 'reflect-metadata';
import { IDataMapper, IList, IListDAL, ITask } from '../../models';
import { Inject, Service } from 'typedi';
import { TaskDataMapper } from './TaskDataMapper';

@Service()
export class ListDataMapper implements IDataMapper<IList, IListDAL> {
  @Inject() private taskDataMapper: TaskDataMapper;

  toDalEntity(entity: IList): IListDAL {
    throw new Error('Not implemented');
  }

  toEntity(dalEntity: IListDAL): IList {
    let tasks: Record<string, ITask>;
    if (dalEntity.tasks) {
      tasks = Object.keys(dalEntity.tasks).reduce((dictionary: Record<string, ITask>, key: string) => {
        dictionary[key] = this.taskDataMapper.toEntity(dalEntity.tasks[key]);
        return dictionary;
      }, {});
    }
    return {
      id: dalEntity._id.toHexString(),
      name: dalEntity.name,
      tasks
    };
  }

}
