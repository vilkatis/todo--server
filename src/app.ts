import { Container } from 'typedi';
import 'reflect-metadata';
import { Action, createExpressServer, InternalServerError, UnauthorizedError, useContainer } from 'routing-controllers';
import { Utils } from './helpers';
import { controllers } from './controllers';
import { middlewares } from './middlewares';
import * as jwt from 'jsonwebtoken';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { ITokenData } from './models/interfaces';

useContainer(Container);

Utils.calculateIdealSaltRounds(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

const app = createExpressServer({
  routePrefix: '/v1',
  currentUserChecker: async (action: Action) => {
    try {
      const token: string = action.request.headers['authorization'].split(' ')[1];
      const secret: string = Utils.getSecret('public_key');
      const decodedToken: ITokenData = jwt.verify(token, secret, {algorithms: ['RS256']}) as ITokenData;
      return decodedToken._id;
    } catch(err) {
      throw new UnauthorizedError('User not authenticated, please log in.')
    }
  },
  controllers,
  middlewares
});

app.listen(3000, async () => {
  try {
    const mongoOptions: MongoClientOptions = {
      useNewUrlParser: true,
      reconnectInterval: 10000,
      reconnectTries: 10
    };
    const client: MongoClient = await MongoClient.connect(process.env.DATABASE_URI, mongoOptions);
    Container.set(Db, client.db());
    console.log('Connected to DB');
  } catch (err) {
    throw new InternalServerError('Unable to connect to DB');
  }
});
