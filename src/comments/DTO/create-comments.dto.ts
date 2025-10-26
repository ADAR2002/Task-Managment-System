import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, MinLength } from "class-validator";


export class CreateCommentsDTO{
    @ApiProperty({example:"add content",description:"add content"})
    @IsString()
    @MinLength(3)
    content:string
}