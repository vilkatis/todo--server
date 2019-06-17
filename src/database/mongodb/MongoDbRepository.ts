import { AbstractRepository } from '../AbstractRepository';
import { MongoDb } from './MongoDb';
import { Collection, InsertOneWriteOpResult } from 'mongodb';

export abstract class MongoDbRepository<T> extends AbstractRepository<T> {
  private readonly _collection: Collection<T>;

  protected constructor(database: MongoDb, collectionName: string) {
    super();
    this._collection = database.getCollection<T>(collectionName);
  }

  async create(item: T): Promise<string> {
    const result: InsertOneWriteOpResult = await this._collection.insertOne(item);
    return result.insertedId.toHexString();
  }

  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  find(item: T): Promise<T[]> {
    throw new Error('Method not implemented.');
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
