import { CorsMiddleware } from './CorsMiddleware';
import { ErrorMiddleware } from './ErrorMiddleware';

export const middlewares: any[] = [
  CorsMiddleware,
  // ErrorMiddleware
];

export * from './CorsMiddleware';
// export * from './ErrorMiddleware';
