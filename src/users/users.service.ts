import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserEntity } from './Entity/create-user.entity';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async me(id): Promise<CreateUserEntity> {
        if(!id){
            throw new HttpException("you need to login",500);
        }
        const user = await this.prisma.user.findFirst({
            where: { id },
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return new CreateUserEntity(user);
    }
}
