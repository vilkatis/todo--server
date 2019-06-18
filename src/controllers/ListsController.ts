import { Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from 'routing-controllers';
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

  @Post('/lists')
  public createList(@CurrentUser({required: true}) userId: string, @Body() list: any): Promise<string> {
    return this._service.createList(list.name, userId);
  }

  @Put('/lists')
  public updateList(@CurrentUser({required: true}) userId: string, @Body() list: any): Promise<boolean> {
    return this._service.updateList(userId, list._id, list.name);
  }

  @Post('/lists/:id/task')
  public addTask(@CurrentUser({required: true}) userId: string, @Param('id') listId: string, @Body() list: any): Promise<boolean> {
    return this._service.addTask(listId, userId, list.name);
  }

  @Put('/lists/:id/task')
  public updateTask(@CurrentUser({required: true}) userId: string, @Param('id') listId: string, @Body() list: any): Promise<boolean> {
    return this._service.updateTask(listId, userId, list);
  }

  @Delete('/lists/:id/task')
  public deleteTask(@CurrentUser({required: true}) userId: string, @Param('id') listId: string, @Body() task: any): Promise<boolean> {
    return this._service.deleteTask(userId, listId, task._id);
  }
}
