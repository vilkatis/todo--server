import { ObjectId } from 'bson';

export interface ITaskDAL {
  _id?: ObjectId;
  name: string;
  isCompleted: boolean;
}
