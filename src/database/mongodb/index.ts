import { Collection, Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class Database {
    public static client: MongoClient;

    public static async connect(): Promise<MongoClient> {
        if (!Database.client) {
            Database.client = await MongoClient.connect(process.env.DATABASE_URI, {useNewUrlParser: true});
        }
        return Database.client;
    }

    public static get db(): Db {
        return Database.client.db();
    }

    public getCollection<T>(collectionName: string): Collection<T> {
        return Database.db.collection<T>(collectionName);
    }

    public disconnect(): void {
        if (Database.client && Database.client.isConnected()) {
            Database.client.close();
        }
    }
}
