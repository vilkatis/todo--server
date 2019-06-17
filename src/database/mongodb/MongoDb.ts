import { Collection, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class MongoDb {
  public static client: MongoClient;

  public static get db(): Db {
    return MongoDb.client.db();
  }

  public static async connect(): Promise<MongoClient> {
    if (!MongoDb.client) {
      MongoDb.client = await MongoClient.connect(process.env.DATABASE_URI, {useNewUrlParser: true});
    }
    return MongoDb.client;
  }

  public getCollection<T>(collectionName: string): Collection<T> {
    return MongoDb.db.collection<T>(collectionName);
  }

  public disconnect(): void {
    if (MongoDb.client && MongoDb.client.isConnected()) {
      MongoDb.client.close();
    }
  }
}
