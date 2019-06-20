import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { Service } from 'typedi';
import { TransformableInfo } from 'logform';

@Service()
export class LoggerService {
  private _logger: Logger;

  constructor() {
    const options: LoggerOptions = {
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.align(),
            format.printf((info: TransformableInfo) => `${info.timestamp} [${info.level}]: ${info.message}`),
          ),
          handleExceptions: true
        })
      ]
    };
    this._logger = createLogger(options);
  }

  info(message: string): void {
    this._logger.info(message);
  }

  debug(message: string): void {
    this._logger.warn(message);
  }

  warn(message: string): void {
    this._logger.warn(message);
  }

  error(message: string, err: Error): void {
    this._logger.error(message, err);
  }
}
