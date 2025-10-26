import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskPolicyService } from 'src/common/utils/task-policy.service';

@Module({
  providers: [TasksService,TaskPolicyService],
  controllers: [TasksController]
})
export class TasksModule {}
