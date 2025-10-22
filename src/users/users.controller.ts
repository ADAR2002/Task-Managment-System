import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserEntity } from './Entity/create-user.entity';
import { JWTAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';

@ApiTags('users')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth("jwt")
@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService){}
    @ApiOperation({ summary: 'Get current user details' })
    @ApiResponse({ status: 200, description: 'Returns the details of the currently logged-in user.' })
    @Get('me')
    async me(@GetUser() user): Promise<CreateUserEntity> {
        try {
        return await this.usersService.me(user.id);
        } catch (error) {
            throw error;
        }
    }
}


