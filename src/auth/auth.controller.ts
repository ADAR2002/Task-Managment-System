import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserEntity } from 'src/auth/Entity/create-user.entity';
import { LoginUserEntity } from 'src/auth/Entity/login-user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDTO } from './DTO/login-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { JWTAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto, description: 'User registration data' })
    @Post('register')
    async register(@Body() body: CreateUserDto): Promise<CreateUserEntity> {
        return await this.authService.register(body);
    }
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiBody({ type: LoginUserDTO, description: 'User login data' })
    @Post('login')
    async login(@Body() body: LoginUserDTO): Promise<LoginUserEntity> {
        return await this.authService.login(body);
    }

    @ApiOperation({ summary: 'refresh token' })
    @ApiResponse({ status: 200, description: 'The user has been successfully refreshed token.' })
    @ApiBody({ type: String, description: 'old token' })
    @Get('refresh')
    async refreshToken(@Body() body): Promise<LoginUserEntity> {
        console.log("Token :",body);
        return await this.authService.refreshToken(body.token);
    }

    @ApiOperation({ summary: 'logout' })
    @UseGuards(JWTAuthGuard)
    @ApiBearerAuth("jwt")
    @ApiResponse({ status: 200, description: 'The user has been successfully logout.' })
    @Delete('logout')
    async logout(@GetUser() user): Promise<string> {
        return await this.authService.logout(user.id);
    }

}

