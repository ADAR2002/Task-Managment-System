import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserEntity } from 'src/auth/Entity/create-user.entity';
import { LoginUserEntity } from 'src/auth/Entity/login-user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDTO } from './DTO/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto, description: 'User registration data' })
    @Post('register')
    async register(@Body() body: CreateUserDto): Promise<CreateUserEntity> {
        try {
            return await this.authService.register(body);
        } catch (error) {
            throw error;
        }
    }
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiBody({ type: LoginUserDTO, description: 'User login data' })
    @Post('login')
    async login(@Body() body: LoginUserDTO): Promise<LoginUserEntity> {
        try {
            return await this.authService.login(body);
        } catch (error) {
            throw error;
        }
    }

}

