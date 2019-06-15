import { Authorized, Body, Get, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';
import { UserService } from '../services/UserService';
import { IToken } from '../models';

@JsonController()
export class UserController {
  @Inject() private service: UserService;

  @Post('/login')
  async login(@Body() loginRequest: any): Promise<IToken> {
    return this.service.login(loginRequest);
  }

  @Post('/register')
  async register(@Body() registerRequest: any): Promise<IToken> {
    return this.service.register(registerRequest);
  }
}
