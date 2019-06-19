import { BadRequestError, Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../providers';
import { IToken, IUser } from '../models';

@JsonController('/auth')
export class UserController {
  @Inject() private _service: UserService;

  @Post('/login')
  async login(@Body() user: IUser): Promise<IToken> {
    if (!user || !user.username || !user.password) throw new BadRequestError('Missing username / password.');
    return this._service.login(user);
  }

  @Post('/register')
  async register(@Body() user: IUser): Promise<IToken> {
    if (!user || !user.username || !user.password) throw new BadRequestError('Missing username / password.');
    return this._service.register(user);
  }
}
