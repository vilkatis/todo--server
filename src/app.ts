import { Container } from 'typedi';
import 'reflect-metadata';
import { Action, createExpressServer, UnauthorizedError, useContainer } from 'routing-controllers';
import { Utils } from './helpers';
import { controllers } from './controllers';
import { middlewares } from './middlewares';
import * as jwt from 'jsonwebtoken';
import { Db, MongoClient } from 'mongodb';
import { ITokenData } from './models/interfaces';

useContainer(Container);

Utils.calculateIdealSaltRounds(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));

const app = createExpressServer({
  routePrefix: '/v1',
  currentUserChecker: async (action: Action) => {
    const token: string = action.request.headers['authorization'].split(' ')[1];
    const secret: string = Utils.getSecret('public_key');
    const decodedToken: ITokenData = jwt.verify(token, secret, {algorithms: ['RS256']}) as ITokenData;
    return decodedToken._id;
  },
  controllers,
  middlewares
});

app.listen(3000, async () => {
  try {
    const client: MongoClient = await MongoClient.connect(process.env.DATABASE_URI, {useNewUrlParser: true});
    Container.set(Db, client.db());
    console.log('Connected to DB');
  } catch (err) {
    console.error('Unable to connect to DB', err);
  }
});
