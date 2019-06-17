export interface IRead<T> {
  find(item: T): Promise<T[]>;
  findOne(item: Partial<T>): Promise<T>;
  findOneById(id: string): Promise<T>;
}
