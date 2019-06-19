import { IDataMapper, ITask, ITaskDAL } from '../../models';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class TaskDataMapper implements IDataMapper<ITask, ITaskDAL> {
  toDalEntity(entity: ITask): ITaskDAL {
    return {
      _id: new ObjectId(entity.id),
      isCompleted: entity.isCompleted,
      name: entity.name
    };
  }

  toEntity(dalEntity: ITaskDAL): ITask {
    return {
      id: dalEntity._id.toHexString(),
      isCompleted: dalEntity.isCompleted,
      name: dalEntity.name
    };
  }
}
