import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TaskPolicyService } from 'src/common/utils/task-policy.service';

@Module({
  providers: [CommentsService,TaskPolicyService],
  controllers: [CommentsController]
})
export class CommentsModule {}
