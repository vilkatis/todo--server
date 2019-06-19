import { TodoController } from './TodoController';
import { UserController } from './UserController';

export const controllers: any[] = [
  TodoController,
  UserController
];

export * from './TodoController';
export * from './UserController';
