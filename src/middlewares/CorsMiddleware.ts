import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import * as cors from 'cors';
import { CorsOptions } from 'cors';

@Middleware({ type: 'before' })
export class CorsMiddleware implements ExpressMiddlewareInterface {
  public corsOptions: CorsOptions;
  public constructor() {
    const whiteList = ['http://localhost:4200'];
    this.corsOptions = {
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        if (whiteList.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
  }

  public use: (req: Request, res: Response, next: NextFunction) => any = cors(this.corsOptions)
}
