import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @ApiProperty({example:"Ahmad",description:"Name of user"})
    name: string;
    @IsEmail()
    @ApiProperty({example:"aaa@gmail.com",description:"Email of user"})
    email: string;
    @ApiProperty({example:"StrongP@ssw0rd!",description:"Password of user"})
    @IsStrongPassword()
    @Length(8, 20)
    password: string;
}