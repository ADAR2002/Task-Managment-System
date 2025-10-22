import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class CreateTaskDTO {
    @IsString()
    @ApiProperty({example:"Finish NestJS project",description:"Title of the task"})
    title: string;
    @ApiProperty({example:"Complete the task management project using NestJS",description:"Description of the task"})
    @IsString()
    description: string;
}