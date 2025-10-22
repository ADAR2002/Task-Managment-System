import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsStrongPassword } from "class-validator"

export class LoginUserDTO {
  @ApiProperty({example:"aaa@gmail.com",description:"Email of user"})
  @IsEmail()
  email: string
  @IsStrongPassword()
  @ApiProperty({example:"StrongP@ssw0rd!",description:"Password of user"})
  password: string
}