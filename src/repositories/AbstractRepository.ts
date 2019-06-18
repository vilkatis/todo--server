import { IRead, IWrite } from '../models';

export abstract class AbstractRepository<T> implements IWrite<T>, IRead<T> {
  abstract create(item: T): Promise<string>;

  abstract delete(id: string): Promise<boolean>;

  abstract update(id: string, item: T): Promise<boolean>;

  abstract find(item: T): Promise<T[]>;

  abstract findOne(item: Partial<T>): Promise<T>;

  abstract findOneById(id: string): Promise<T>;
}
