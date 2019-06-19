import { BadRequestError, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Inject } from 'typedi';
import { ListsService } from '../providers';
import { IList, ITask } from '../models';


@JsonController('/todo')
export class TodoController {
  @Inject() private _service: ListsService;

  @Get('/lists')
  getLists(@CurrentUser({required: true}) userId: string): Promise<IList[]> {
    return this._service.getLists(userId);
  }

  @Post('/lists')
  public createList(@CurrentUser({required: true}) userId: string, @Body() list: IList): Promise<string> {
    if (!list || !list.name) throw new BadRequestError('Missing list object / list name.');
    return this._service.createList(userId, list.name);
  }

  @Put('/lists')
  public updateList(@CurrentUser({required: true}) userId: string, @Body() list: IList): Promise<boolean> {
    if (!list || !list.id || !list.name) throw new BadRequestError('Missing list object / list id / list name.');
    return this._service.updateList(userId, list);
  }

  @Post('/lists/:id/task')
  public addTask(@CurrentUser({required: true}) userId: string, @Param('id') listId: string, @Body() task: ITask): Promise<string> {
    return this._service.addTask(listId, userId, task.name);
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
