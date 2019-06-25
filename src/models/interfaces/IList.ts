import { ITask } from './ITask';

export interface IList {
  id?: string;
  name: string;
  tasks?: Record<string, ITask>;
  count?: number;
}
