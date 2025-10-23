import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { Prisma, TaskStatus } from '@prisma/client';


@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) { }
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
    async removeTask(id: number, userId: any): Promise<string> {
        const ok = await this.prisma.safeExecute(this.prisma.task.delete({
            where: { id, userId },
        }));
        if (!ok) {
            throw new NotFoundException("Task not found Task");
        }
        return "Remove task";
    }
    async updateTask(id: number, userId: number, body): Promise<string> {
        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id } }));
        if (!task || task.userId !== userId) {
            throw new ForbiddenException('You are not allowed to edit this task');
        }
        await this.prisma.safeExecute(this.prisma.task.update({
            where: { id },
            data: body,
        }));
        return "Update task";
    }
}
