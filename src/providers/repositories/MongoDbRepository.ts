import {
  Collection,
  Db,
  FilterQuery,
  InsertOneWriteOpResult,
  ObjectId,
  UpdateQuery,
  UpdateWriteOpResult
} from 'mongodb';
import { InternalServerError, NotFoundError } from 'routing-controllers';

export abstract class MongoDbRepository<T> {
  private readonly _collection: Collection<T>;

  protected constructor(db: Db, collectionName: string) {
    this._collection = db.collection<T>(collectionName);
  }

  async create(item: T): Promise<string> {
    try {
      const result: InsertOneWriteOpResult = await this._collection.insertOne(item);
      return result.insertedId.toHexString();
    } catch (err) {
      throw new InternalServerError('DB: Failed to perform insert.');
    }
  }

  find(item: Partial<T>): Promise<T[]> {
    try {
      return this._collection.find(item).toArray();
    } catch (err) {
      throw new InternalServerError('Db: Failed to perform query.');
    }
  }

  async findOne(filterQuery: Partial<T>): Promise<T> {
    let item: T;
    try {
      item = await this._collection.findOne(filterQuery);
    } catch (err) {
      throw new InternalServerError('Db: Failed to perform query.');
    }
    if (item) {
      return item;
    } else {
      throw new NotFoundError('Db: No record found.')
    }
  }

  async findOneById(id: string): Promise<T> {
    const filterQuery: FilterQuery<T> = {_id: new ObjectId(id)};
    let item: T;
    try {
      item = await this._collection.findOne(filterQuery);
    } catch (err) {
      throw new InternalServerError('Db: Failed to perform query.');
    }
    if (item) {
      return item;
    } else {
      throw new NotFoundError('Db: No record found.')
    }
  }

  async updateOne(id: string, updateQuery: UpdateQuery<T>): Promise<boolean> {
    try {
      const filterQuery: FilterQuery<T> = {_id: new ObjectId(id)};
      const result: UpdateWriteOpResult = await this._collection.updateOne(filterQuery, updateQuery);
      return !!result.result.ok;
    } catch (err) {
      throw new InternalServerError('Db: Failed to perform update.');
    }
  }
}
