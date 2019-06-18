import { AbstractRepository } from './AbstractRepository';
import { Collection, Db, InsertOneWriteOpResult } from 'mongodb';
import { Container } from 'typedi';

export abstract class MongoDbRepository<T> extends AbstractRepository<T> {
  private readonly _collection: Collection<T>;

  protected constructor(collectionName: string) {
    super();
    const db: Db = Container.get(Db);
    this._collection = db.collection<T>(collectionName);
  }

  async create(item: T): Promise<string> {
    const result: InsertOneWriteOpResult = await this._collection.insertOne(item);
    return result.insertedId.toHexString();
  }

  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  find(item: Partial<T>): Promise<T[]> {
    return this._collection.find(item).toArray();
  }

  findOne(item: Partial<T>): Promise<T> {
    return this._collection.findOne(item);
  }

  findOneById(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
