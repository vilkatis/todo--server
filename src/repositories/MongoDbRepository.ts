import {
  Collection,
  Db,
  FilterQuery,
  InsertOneWriteOpResult,
  ObjectId,
  UpdateQuery,
  UpdateWriteOpResult
} from 'mongodb';
import { Container } from 'typedi';

export abstract class MongoDbRepository<T> {
  private readonly _collection: Collection<T>;

  protected constructor(collectionName: string) {
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

  async find(item: Partial<T>): Promise<T[]> {
    const list: T[] = await this._collection.find(item).toArray();
    return list.map((item: any) => {
      return {
        ...item,
        _id: item._id.toHexString()
      };
    });
  }

  findOne(item: Partial<T>): Promise<T> {
    return this._collection.findOne(item);
  }

  findOneById(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async updateOne(id: string, updateQuery: UpdateQuery<T>): Promise<boolean> {
    const filterQuery: FilterQuery<T> = {_id: new ObjectId(id)};
    const result: UpdateWriteOpResult = await this._collection.updateOne(filterQuery, updateQuery);
    return !!result.result.ok;
  }
}
