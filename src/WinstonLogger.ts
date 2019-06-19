import { createLogger, format, LeveledLogMethod, Logger, LoggerOptions, LogMethod, transports } from 'winston';
import { Service } from 'typedi';

@Service()
export class WinstonLogger {
  private _logger: Logger;
  public log: LogMethod;
  public error: LeveledLogMethod;
  public warn: LeveledLogMethod;
  public help: LeveledLogMethod;
  public data: LeveledLogMethod;
  public debug: LeveledLogMethod;
  public prompt: LeveledLogMethod;
  public http: LeveledLogMethod;
  public verbose: LeveledLogMethod;
  public input: LeveledLogMethod;
  public silly: LeveledLogMethod;
  public emerg: LeveledLogMethod;
  public alert: LeveledLogMethod;
  public crit: LeveledLogMethod;
  public warning: LeveledLogMethod;
  public notice: LeveledLogMethod;

  constructor() {
    const options: LoggerOptions = {
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.align(),
            format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
          ),
          handleExceptions: true
        })
      ]
    };
    const logger: Logger = createLogger(options);
    this._logger = logger;
    this.error = logger.error;
    this.warn = logger.warn;
  }

  info(message: string, ...meta: any[]): void {
    this._logger.info(message, meta);
  }
}
