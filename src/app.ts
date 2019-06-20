import 'reflect-metadata';
import { Action, createExpressServer, UnauthorizedError, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { MongoDB } from './MongoDB';
import './providers';
import { Utils } from './helpers';
import { controllers } from './controllers';
import { middlewares } from './middlewares';
import * as jwt from 'jsonwebtoken';
import { ITokenData } from './models/interfaces';
useContainer(Container);



Utils.calculateIdealSaltRounds(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

const app = createExpressServer({
  routePrefix: '/v1',
  // defaultErrorHandler: false,
  currentUserChecker: async (action: Action) => {
    try {
      const token: string = action.request.headers['authorization'].split(' ')[1];
      const secret: string = Utils.getSecret('public_key');
      const decodedToken: ITokenData = jwt.verify(token, secret, {algorithms: ['RS256']}) as ITokenData;
      return decodedToken._id;
    } catch (err) {
      throw new UnauthorizedError('User not authenticated, please log in.')
    }
  },
  controllers,
  middlewares
});

app.listen(3000, async () => {
  await MongoDB.init();
});
