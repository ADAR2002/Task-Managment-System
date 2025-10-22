import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { CreateTaskEntity } from './Entity/create-task.entity';
import { console } from 'inspector';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) { }
    async createTask(body: CreateTaskDTO, id: number): Promise<CreateTaskEntity> {
        const task = await this.prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                userId: id,
            },
        });
        return new CreateTaskEntity(task);
    }
    async getTasks(id: number): Promise<CreateTaskEntity[]> {
        const tasks = await this.prisma.task.findMany({
            where: { userId: id },
        });
        return tasks.map(task => new CreateTaskEntity(task));
    }
    async removeTask(id: number, userId: any): Promise<string> {
        try {
            console.log("id", id);
            console.log("userId", userId);
            const ok = await this.prisma.task.delete({
                where: { id, userId },
            });
            if (!ok) {
                throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
            }
            return "Remove task";
        } catch (error) {
            throw new HttpException("somthing wronge", HttpStatus.BAD_REQUEST);
        }
    }
    async updateTask(id: number, userId: number, body): Promise<string> {
        try {
            await this.prisma.task.update({
                where:{id,userId},
                data : body
            });
            return "Update task";
        } catch (error) {
            throw new HttpException('Somthing wronge', HttpStatus.BAD_REQUEST)

        }
    }
}
