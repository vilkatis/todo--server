import { Service } from 'typedi';
import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import { WinstonLogger } from './WinstonLogger';

@Service()
export class Redis {
  public getAsync: (key: string) => Promise<string>;
  public setAsync: (key: string, value: string) => Promise<void>;
  public delAsync: (key: string) => Promise<boolean>;

  constructor(private logger: WinstonLogger) {
    const client: RedisClient = createClient(process.env.REDIS_URI);
    client.on('connect', () => logger.info('Redis connected'));
    client.on('error', (err: Error) => logger.error('Redis error', err));
    this.getAsync = promisify(client.get).bind(client);
    this.setAsync = promisify(client.set).bind(client);
    this.delAsync = promisify(client.del.bind(client));
  }

  // public getAsync(key: string): Promise<string> {
  //   try {
  //     return this.getAsync(key);
  //   } catch (err) {
  //
  //   }
  // }
}
