import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async safeExecute<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
