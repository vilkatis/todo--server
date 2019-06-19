import { Inject, Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'routing-controllers';
import { IToken, ITokenData, IUserDAL } from '../../models';
import { Utils } from '../../helpers';
import { UsersRepository } from '../repositories';
import { IUser } from '../../models';

@Service()
export class UserService {
  @Inject() private _userRepository: UsersRepository;

  async register(user: IUser): Promise<IToken> {
    let userDAL: IUserDAL;
    try {
      userDAL = await this._userRepository.findOne({username: user.username});
    } catch (err) {
      // No such user exists
    }
    if (userDAL) throw new BadRequestError('Username already exists.');
    const encryptedPassword: string = bcrypt.hashSync(user.password, parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
    const userId: string = await this._userRepository.create({username: user.username, encryptedPassword});
    return this._createToken(userId);
  }

  async login(user: IUser): Promise<IToken> {
    const dbUser: IUserDAL = await this._userRepository.findOne({username: user.username});
    if ((!dbUser) || (!await bcrypt.compare(user.password, dbUser.encryptedPassword))) throw new BadRequestError('Incorrect user or password.');
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
