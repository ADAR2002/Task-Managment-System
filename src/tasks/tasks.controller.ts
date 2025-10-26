import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { JWTAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = 'uploads';

function fileFilter(req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    if (allowed.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestException('Unsupported file type'), false);
    }
}


@ApiTags('tasks')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth("jwt")
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }


    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({ type: CreateTaskDTO, description: 'User registration data' })
    @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
    @Post('')
    async createTask(@Body() body: CreateTaskDTO, @GetUser() user): Promise<CreateTaskEntity> {
        return await this.tasksService.createTask(body, user.id);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'Returns all tasks.' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'status of Task' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'word' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'number of page' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'size of page' })
    @Get('')
    async getTasks(@GetUser() user, @Query() query): Promise<CreateTaskEntity[]> {
        return await this.tasksService.getTasks(user.id, query);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @ApiOperation({ summary: 'Remove a task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully removed.' })
    @Delete(':id')
    async removeTask(@Param('id', ParseIntPipe) id: number, @GetUser() userId): Promise<string> {
        return await this.tasksService.removeTask(id, userId.id);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @ApiOperation({ summary: 'Update a task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
    @Patch(':id')
    @ApiBody({})
    async updateTask(@Param('id', ParseIntPipe) id: number, @GetUser() userId, @Body() body): Promise<string> {
        return await this.tasksService.updateTask(id, userId.id, body);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @ApiOperation({ summary: 'Get a task' })
    @ApiResponse({ status: 200})
    @Get(':id')
    async getTask(@Param('id', ParseIntPipe) id: number, @GetUser() userId){
        return await this.tasksService.getTask(id, userId.id);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @Post(":id/attachments")
    @ApiOperation({ summary: 'رفع عدة ملفات دفعة واحدة' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary', // يخبر Swagger أن العناصر ملفات
                    },
                },
            },
        },
    })
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, UPLOADS_DIR);
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    const fileName = `${uuidv4()}${ext}`;
                    cb(null, fileName);
                },
            }),
            fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB لكل ملف
        }),
    )
    async uploadAttachments(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files || !files.length) return { message: 'No files uploaded' };
        const result = await this.tasksService.addAttachments(id, user.id, files);
        return result;
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------

    @Get(':id/attachments/')
    @ApiOperation({ summary: 'get all files' })
    async listAttachments(@Param('id', ParseIntPipe) id: number, @GetUser() user) {
        return this.tasksService.getAttachments(id, user.id);
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------------
    @ApiOperation({ summary: 'حذف ملف واحد' })
    @Delete(':id/attachments/:attachmentId')
    async deleteAttachment(@Param('attachmentId', ParseIntPipe) attachmentId: number, @GetUser() user) {
        return this.tasksService.deleteAttachments(attachmentId, user.id);
    }
}


