import { Container, Service } from 'typedi';
import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import { LoggerService } from '../index';

@Service()
export class RedisService {
  private _getAsync: (key: string) => Promise<string>;
  private _setAsync: (key: string, value: string) => Promise<void>;
  private _delAsync: (key: string) => Promise<boolean>;
  private _logger: LoggerService;

  constructor() {
    const _logger = Container.get(LoggerService);
    this._logger = _logger;
    const client: RedisClient = createClient(process.env.REDIS_URI);
    client.on('connect', () => _logger.info('Redis connected'));
    client.on('error', (err: Error) => _logger.error('Redis error', err));
    this.getAsync = promisify(client.get).bind(client);
    this.setAsync = promisify(client.set).bind(client);
    this.delAsync = promisify(client.del.bind(client));
  }

  public getAsync(key: string): Promise<string> {
    try {
      return this._getAsync(key);
    } catch (err) {
      this._logger.error('RedisService getAsync error', err);
      return undefined;
    }
  }

  public async setAsync(key: string, value: string): Promise<void> {
    try {
      await this._setAsync(key, value);
    } catch (err) {
      this._logger.error('RedisService setAsync error', err);
    }
  }

  public async delAsync(key: string): Promise<boolean> {
    try {
      await this._delAsync(key);
    } catch (err) {
      return false;
    }
  }
}
