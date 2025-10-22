import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserEntity } from 'src/auth/Entity/create-user.entity';
import { LoginUserEntity } from 'src/auth/Entity/login-user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDTO } from './DTO/login-user.dto';
import bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }
    async register(body: CreateUserDto): Promise<CreateUserEntity> {
        try {
            body.password = bcrypt.hashSync(body.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email: body.email,
                    password: body.password,
                    name: body.name,
                },
            });
            return new CreateUserEntity(user);
        } catch (error) {
            throw new HttpException('User registration failed', 500);
        }
    }
    async login(body: LoginUserDTO): Promise<LoginUserEntity> {
        const email = body.email?.trim().toLowerCase();
        if (!email || !body.password) {
            throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
        }
        const user = await this.prisma.user.findFirst({
            where: { email },
        });
        console.log(email);

        if (!user) {
            throw new HttpException('Email or password wrong', HttpStatus.BAD_REQUEST);
        }

        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword) {
            throw new HttpException('Email or password wrong', HttpStatus.BAD_REQUEST);
        }

        const token = this.jwt.sign({ id: user.id });
        return new LoginUserEntity({ token });
    }

}
