import { Inject, Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Database } from '../database';
import { BadRequestError } from 'routing-controllers';
import { IToken, ITokenData, IUserDB } from '../models';
import { Utils } from '../helpers';

@Service()
export class UserService {
  @Inject() database: Database;

  async register({username, password}: any) {
    if (!password || !username) throw new BadRequestError('Missing username or password.');
    const collection = this.database.getCollection('users');
    if (await collection.findOne({username})) throw new BadRequestError('Username already exists.');
    const encryptedPassword: string = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const dbUser = await collection.insertOne({username, encryptedPassword});
    return this.createToken(dbUser);
  }

  async login({username, password}: any) {
    if (!password || !username) throw new BadRequestError('Missing username or password.');
    const collection = this.database.getCollection('users');
    const dbUser: IUserDB = await collection.findOne({username});
    if (!dbUser) throw new BadRequestError('Incorrect user or password.');
    if (!await bcrypt.compare(password, dbUser.encryptedPassword)) throw new BadRequestError('Incorrect user or password.');
    return this.createToken(dbUser);
  }

  private createToken(user: any): IToken {
    const expiresIn = 60 * 60;
    const secret: string = Utils.getSecret('private_key');
    const dataStoredInToken: ITokenData = {_id: user._id};
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {expiresIn, algorithm: 'RS256'}),
    };
  }
}
