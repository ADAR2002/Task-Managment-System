import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { console } from 'inspector';

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
    async getTasks(id: number): Promise<CreateTaskEntity[]> {
        const tasks = await this.prisma.safeExecute(this.prisma.task.findMany({
            where: { userId: id },
        }));
        return tasks.map(task => new CreateTaskEntity(task));
    }
    async removeTask(id: number, userId: any): Promise<string> {
        const ok = await this.prisma.safeExecute(this.prisma.task.delete({
            where: { id, userId },
        }));
        if (!ok) {
            throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
        }
        return "Remove task";
    }
    async updateTask(id: number, userId: number, body): Promise<string> {

        const task = await this.prisma.safeExecute(this.prisma.task.findUnique({ where: { id } }));
        if (!task || task.userId !== userId) {
            throw new HttpException('Task not found or unauthorized', HttpStatus.NOT_FOUND);
        }
        await this.prisma.safeExecute(this.prisma.task.update({
            where: { id },
            data: body,
        }));
        return "Update task";
    }
}
