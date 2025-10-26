import { Injectable } from '@nestjs/common';
import { CreateCommentsEntity } from './entity/create-comments.entity';
import { CreateCommentsDTO } from './DTO/create-comments.dto';
import { TaskPolicyService } from 'src/common/utils/task-policy.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService, private readonly policy: TaskPolicyService) { }
    async addComment(taskId: number, userId: number, body: CreateCommentsDTO): Promise<CreateCommentsEntity> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: taskId } }));
        this.policy.canAccess(userId, task);
        return new CreateCommentsEntity(await this.prisma.safeExecute(this.prisma.comment.create({
            data: {
                content: body.content,
                userId: userId,
                taskId: taskId
            }
        })));
    }
    //-------------------------------------------------------------------------------------------------
    async editComment(taskId: number, userId: number, id: number,body:CreateCommentsDTO): Promise<CreateCommentsEntity> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: taskId } }));
        this.policy.canAccess(userId, task);
        return new CreateCommentsEntity(await this.prisma.safeExecute(this.prisma.comment.update({
            where:{id},
            data: {
                content: body.content,
            }
        })));
    }
    //-------------------------------------------------------------------------------------------------
    async removeComment(taskId: number, userId: number, id: number): Promise<String> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: taskId } }));
        this.policy.canAccess(userId, task);
        await this.prisma.safeExecute(
            this.prisma.comment.delete({
                where: { id }
            })
        );

        return "removed Comment successful";
    }
    //-------------------------------------------------------------------------------------------------

    async getComments(taskId: number, userId: number): Promise<CreateCommentsEntity[]> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: taskId } }));
        this.policy.canAccess(userId, task);
        const comments = await this.prisma.safeExecute(
            this.prisma.comment.findMany({where:{taskId,userId}})
        );
        return comments.map(f => new CreateCommentsEntity(f));
    }

}
