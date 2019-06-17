import { Container } from 'typedi';
import 'reflect-metadata';
import { Action, createExpressServer, UnauthorizedError, useContainer } from 'routing-controllers';
import { Utils } from './helpers';
import { controllers } from './controllers';
import { MongoDb } from './database/mongodb/MongoDb';
import { middlewares } from './middlewares';
import * as jwt from 'jsonwebtoken';

useContainer(Container);

Utils.calculateIdealSaltRounds(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

const app = createExpressServer({
  routePrefix: '/v1',
  authorizationChecker: (action: Action) => {
    try {
      const token: string = action.request.headers['authorization'].split(' ')[1];
      const secret: string  = Utils.getSecret('public_key');
      const decodedToken = jwt.verify(token, secret, {algorithms: ['RS256']});
    } catch (err) {
      throw new UnauthorizedError('Unauthorized access, please log in.');
    }
    return true;
  },
  controllers,
  middlewares
});

app.listen(3000, async () => {
  try {
    await MongoDb.connect();
    console.log('Connected to DB');
  } catch (err) {
    console.error('Unable to connect to DB', err);
  }
});
