import {
    BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Duplicate value violates unique constraint');
      case 'P2025':
        throw new NotFoundException('Record not found');
      case 'P2003':
        throw new ForbiddenException('Foreign key constraint failed');
      case 'P2000':
        throw new BadRequestException('Invalid data provided');
      case 'P2010':
        throw new UnauthorizedException('Invalid credentials');
      default:
        throw new InternalServerErrorException(
          `Database error (code: ${error.code})`,
        );
    }
  }

  throw new InternalServerErrorException(error.message);
}
