import { Authorized, Get, JsonController } from 'routing-controllers';


@Authorized()
@JsonController()
export class TodoController {
  @Authorized()
  @Get('/todo/lists')
  async getStatus(): Promise<any> {
    return 'STATUS';
  }
}
