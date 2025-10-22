import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
        body.password = await bcrypt.hashSync(body.password, 10);
        const user = await this.prisma.safeExecute(this.prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        }));
        return new CreateUserEntity(user);
    }
    async login(body: LoginUserDTO): Promise<LoginUserEntity> {
        const email = body.email?.trim().toLowerCase();
        if (!email || !body.password) {
            throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
        }
        const user = await this.prisma.safeExecute(this.prisma.user.findFirst({
            where: { email },
        }));
        if (!user) {
            throw new HttpException('Email or password wrong', HttpStatus.BAD_REQUEST);
        }
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword) {
            throw new HttpException('Email or password wrong', HttpStatus.BAD_REQUEST);
        }
        const accessToken = this.jwt.sign({ id: user.id }, { expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ id: user.id }, { expiresIn: '7d' });
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.prisma.safeExecute(this.prisma.refreshToken.create({
            data: {
                token: hashedRefresh,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        }));
        return new LoginUserEntity({ accessToken, refreshToken });
    }

    async refreshToken(oldToken: string): Promise<LoginUserEntity> {
        const payload = this.jwt.verify(oldToken);
        const userId = payload.id;

        const stored = await this.prisma.safeExecute(this.prisma.refreshToken.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 1
        }));
        if (!stored.length || !(await bcrypt.compare(oldToken, stored[0].token))) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
        const accessToken = this.jwt.sign({ id: userId }, { expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ id: userId }, { expiresIn: '7d' });
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.prisma.safeExecute(this.prisma.refreshToken.update({
            where: { id: stored[0].id },
            data: {
                token: hashedRefresh,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        }));
        return new LoginUserEntity({ accessToken, refreshToken });
    }
    async logout(userId: number): Promise<string> {
        await this.prisma.safeExecute(this.prisma.refreshToken.deleteMany({ where: { userId } }));
        return 'Logged out successfully';
    }

}
