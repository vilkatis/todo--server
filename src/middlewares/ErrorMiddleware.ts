import { NextFunction, Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { LoggerService } from '../providers';

@Middleware({type: 'after'})
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {

  constructor(private _logger: LoggerService) {
  }

  public error(error: HttpError, request: Request, response: Response, next: NextFunction) {
    response.status(error.httpCode ? error.httpCode : 500);
    this._logger.error('Server error', error);
    response.json(error);
  }
}
