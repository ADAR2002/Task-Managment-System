import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { CreateCommentsDTO } from './DTO/create-comments.dto';
import { CreateCommentsEntity } from './entity/create-comments.entity';

@Controller('tasks/:taskId/comments')
@ApiTags('Comments')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth("jwt")

export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }
    @Post('')
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiBody({ type: CreateCommentsDTO, description: 'comment data' })
    @ApiResponse({ status: 201 })
        
    async addComments(@Param('taskId', ParseIntPipe) taskId: number, @GetUser() userId, @Body() body: CreateCommentsDTO): Promise<CreateCommentsEntity> {
        return await this.commentsService.addComment(taskId, userId.id, body);
    }
    //---------------------------------------------------------------------------------------------------------------------------
    @Delete(':id')
    @ApiOperation({ summary: 'remove comment' })
    @ApiResponse({ status: 200})
    async removeComments(@Param('taskId', ParseIntPipe) taskId: number, @GetUser() userId,@Param('id', ParseIntPipe) id: number) {
        return await this.commentsService.removeComment(taskId,userId.id,id);
    }
    //---------------------------------------------------------------------------------------------------------------------------
    @Patch(':id')
    @ApiOperation({ summary: 'update a comment' })
    @ApiResponse({ status: 200}) 
    async editComments(@Param('taskId', ParseIntPipe) taskId: number, @GetUser() userId,@Param('id', ParseIntPipe) id: number, @Body() body: CreateCommentsDTO) {
        return await this.commentsService.editComment(taskId,userId.id,id,body);
    }
    //---------------------------------------------------------------------------------------------------------------------------
    @Get('')
    @ApiOperation({ summary: 'Get task' })
    @ApiResponse({ status: 200 })
    async getComments(@Param('taskId', ParseIntPipe) taskId: number, @GetUser() userId): Promise<CreateCommentsEntity[]> {
        return await this.commentsService.getComments(taskId,userId.id);
    }

}
