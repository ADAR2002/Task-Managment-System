import { Module, Res } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptore';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [UsersModule, TasksModule, PrismaModule, AuthModule, CommentsModule],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor
    }
  ],
})
export class AppModule { }
