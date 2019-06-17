import { Inject, Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'routing-controllers';
import { IToken, ITokenData, IUserDAL } from '../models';
import { Utils } from '../helpers';
import { UsersRepository } from '../database';

@Service()
export class UserService {
  @Inject() userRepository: UsersRepository;

  async register({username, password}: any): Promise<IToken> {
    if (!password || !username) throw new BadRequestError('Missing username or password.');
    if (await this.userRepository.findOne({username})) throw new BadRequestError('Username already exists.');
    const encryptedPassword: string = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const userId: string = await this.userRepository.create({username, encryptedPassword});
    return this._createToken(userId);
  }

  async login({username, password}: any) {
    if (!password || !username) throw new BadRequestError('Missing username or password.');
    const dbUser: IUserDAL = await this.userRepository.findOne({username});
    if (!dbUser) throw new BadRequestError('Incorrect user or password.');
    if (!await bcrypt.compare(password, dbUser.encryptedPassword)) throw new BadRequestError('Incorrect user or password.');
    return this._createToken(dbUser._id);
  }

  private _createToken(_id: string): IToken {
    const expiresIn = 60 * 60;
    const secret: string = Utils.getSecret('private_key');
    const dataStoredInToken: ITokenData = {_id};
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {expiresIn, algorithm: 'RS256'}),
    };
  }
}
