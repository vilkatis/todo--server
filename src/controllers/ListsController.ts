import { CurrentUser, Get, JsonController } from 'routing-controllers';
import { Inject } from 'typedi';
import { ListsService } from '../services/ListsService';
import { IListDAL } from '../models/interfaces';


@JsonController()
export class ListsController {
  @Inject() private _service: ListsService;

  @Get('/lists')
  getLists(@CurrentUser({required: true}) userId: string): Promise<IListDAL[]> {
    return this._service.getLists(userId);
  }
}
