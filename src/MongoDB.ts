import { CollectionCreateOptions, Db, MongoClient, MongoClientOptions } from 'mongodb';
import { Container } from 'typedi';
import { InternalServerError } from 'routing-controllers';
import { IUser } from './models';

export class MongoDB {
  public static options: MongoClientOptions = {
    useNewUrlParser: true,
    reconnectInterval: 10000,
    reconnectTries: 10
  };

  public static async init(): Promise<void> {
    const db: Db = await this.connect();
    await this.initCollections(db);
  }

  public static async connect(): Promise<Db> {
    try {
      const client: MongoClient = await MongoClient.connect(process.env.DATABASE_URI, MongoDB.options);
      const db: Db = client.db();
      Container.set(Db, db);
      return db;
    } catch (err) {
      throw new InternalServerError('Unable to connect to DB');
    }
  }

  public static async initCollections(db: Db): Promise<void> {
    const collections: { name: string }[] = await db.listCollections({}, {nameOnly: true}).toArray();
    const collectionNames: string[] = collections.map((collection: { name: string }) => collection.name);
    if (collectionNames.indexOf('users') === -1) await MongoDB.createUsersCollection(db);
    if (collectionNames.indexOf('lists') === -1) await MongoDB.createListsCollection(db);

  }

  public static async createUsersCollection(db: Db): Promise<void> {
    const options: CollectionCreateOptions = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          additionalProperties: false,
          required: ['username', 'encryptedPassword'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            username: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            encryptedPassword: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    };
    try {
      await db.createCollection<IUser>('users', options);
    } catch (err) {
      throw new InternalServerError('Db: Failed to create users collection.');
    }
  }

  public static async createListsCollection(db: Db): Promise<void> {
    const options: CollectionCreateOptions = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          additionalProperties: false,
          required: ['userId', 'name'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            tasks: {
              bsonType: 'object',
              description: 'must be a string and is not required',
              patternProperties: {
                '^.*$': {
                  additionalProperties: false,
                  required: ['name', 'isCompleted'],
                  properties: {
                    _id: {
                      bsonType: 'objectId'
                    },
                    name: {
                      bsonType: 'string',
                      description: 'must be a string and is required'
                    },
                    isCompleted: {
                      bsonType: 'bool',
                      description: 'must be a boolean and is required'
                    },
                  }
                }
              }
            }
          }
        }
      }
    };
    try {
      await db.createCollection<IUser>('lists', options);
    } catch (err) {
      throw new InternalServerError('Db: Failed to create users collection.');
    }
  }
}
