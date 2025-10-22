import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { JWTAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';

@ApiTags('tasks')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth("jwt")
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
    @Post('')
    async createTask(@Body() body: CreateTaskDTO, @GetUser() user): Promise<CreateTaskEntity> {
        return await this.tasksService.createTask(body, user.id);
    }
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'Returns all tasks.' })
    @Get('')
    async getTasks(@GetUser() user): Promise<CreateTaskEntity[]> {
        return await this.tasksService.getTasks(user.id);
    }
    @ApiOperation({ summary: 'Remove a task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully removed.' })
    @Delete(':id')
    async removeTask(@Param('id',ParseIntPipe) id : number , @GetUser() userId): Promise<string> {
        return await this.tasksService.removeTask(id,userId.id);
    }
    @ApiOperation({ summary: 'Update a task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
    @Patch(':id')
    async updateTask(@Param('id',ParseIntPipe) id : number ,@GetUser() userId,@Body() body) : Promise<string> {
        return await this.tasksService.updateTask(id, userId.id,body);
    }
}
