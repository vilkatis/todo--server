import { Service } from 'typedi';
import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';

@Service()
export class Redis {
  getAsync: (key: string) => Promise<string>;
  setAsync: (key: string, value: string) => Promise<void>;
  set: any;

  constructor() {
    const client: RedisClient = createClient(process.env.REDIS_URI);
    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err: Error) => console.log('Redis error', err));
    this.getAsync = promisify(client.get).bind(client);
    this.setAsync = promisify(client.set).bind(client);
    this.set = client.set.bind(client);
  }
}
