import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { Attachment, Prisma, TaskStatus } from '@prisma/client';
import { TaskPolicyService } from 'src/common/utils/task-policy.service';
import path from 'path';


@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService, private readonly policy: TaskPolicyService) { }
    async createTask(body: CreateTaskDTO, id: number): Promise<CreateTaskEntity> {
        const task = await this.prisma.safeExecute(this.prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                userId: id,
            },
        }));
        return new CreateTaskEntity(task);
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async getTasks(userId: number, query: any): Promise<CreateTaskEntity[]> {
        const { page = 1, limit = 10 } = query;
        const search = query.search;
        const status = query.status;
        let statusEnum: TaskStatus | undefined = undefined;
        if (status) {
            const normalized = String(status).trim().toUpperCase().replace(/[-\s]+/g, '_');
            const allowed = ['PENDING', 'IN_PROGRESS', 'DONE'];
            if (!allowed.includes(normalized)) {
                throw new HttpException('Invalid status value', HttpStatus.BAD_REQUEST);
            }
            statusEnum = normalized as TaskStatus;
        }
        const where: Prisma.TaskWhereInput = {
            userId,
            ...(statusEnum ? ({ status: statusEnum }) : {}),
            ...(search ? {
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ]
            } : {}),
        };
        const tasks = await this.prisma.safeExecute(
            this.prisma.task.findMany(
                {
                    where: where,
                    skip: ((Number(page) - 1) * Number(limit)),
                    take: Number(limit)
                }
            )
        );
        return tasks.map(task => new CreateTaskEntity(task));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async getTask(id: number, userId: number) {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id } }));
        this.policy.canAccess(userId, task);

        const newTask =  await this.prisma.safeExecute(this.prisma.task.findFirst({
            where: { id },
            include: {
                Attachment:true,
                Comment: {
                    include: { user: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'asc' },
                },
            },
        }));
        return newTask;
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async removeTask(id: number, userId: any): Promise<string> {
        const ok = await this.prisma.safeExecute(this.prisma.task.delete({
            where: { id, userId },
        }));
        if (!ok) {
            throw new NotFoundException("Task not found Task");
        }
        return "Remove task";
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async updateTask(id: number, userId: number, body): Promise<string> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id } }));
        this.policy.canAccess(userId, task);

        await this.prisma.safeExecute(this.prisma.task.update({
            where: { id },
            data: body,
        }));
        return "Update task";
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async addAttachments(id: number, userId: number, files: Express.Multer.File[]): Promise<Attachment[]> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id } }));
        this.policy.canAccess(userId, task);
        const createOps = files.map(f => this.prisma.attachment.create({
            data: {
                filename: f.originalname,
                path: f.filename,
                mimetype: f.mimetype,
                size: f.size,
                taskId: id
            }
        }));
        return this.prisma.$transaction(createOps);
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async getAttachments(taskId: number, userId: number) {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: taskId } }));
        this.policy.canAccess(userId, task);
        return await this.prisma.attachment.findMany({ where: { taskId } });
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    async deleteAttachments(id: number, userId: number) {
        const att = await this.prisma.attachment.findUnique({ where: { id } });
        if (!att) return new NotFoundException("Not found file");

        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id: att.taskId } }));
        this.policy.canAccess(userId, task);
        const fs = await import('fs/promises');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadsDir, att.path);
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn('Failed to delete file from disk', filePath, err);
        }
        await this.prisma.attachment.delete({ where: { id } });
        return { message: 'Deleted' };
    }
}
