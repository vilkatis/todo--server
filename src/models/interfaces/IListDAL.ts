import { ObjectId } from 'bson';
import { ITaskDAL } from './ITaskDAL';

export interface IListDAL {
  _id?: ObjectId;
  userId: string;
  name: string;
  tasks?: Record<string, ITaskDAL>;
}
