export interface IWrite<T> {
  create(item: T): Promise<string>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
