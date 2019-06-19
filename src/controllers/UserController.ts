import { Body, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../services/UserService';
import { IToken } from '../models';

@JsonController('/auth')
export class UserController {
  @Inject() private _service: UserService;

  @Post('/login')
  async login(@Body() loginRequest: any): Promise<IToken> {
    return this._service.login(loginRequest);
  }

  @Post('/register')
  async register(@Body() registerRequest: any): Promise<IToken> {
    return this._service.register(registerRequest);
  }
}
