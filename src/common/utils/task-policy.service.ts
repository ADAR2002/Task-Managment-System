import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";


@Injectable()
export class TaskPolicyService{

    canAccess(userId:number ,task :any){
            if(!task)throw new NotFoundException('Task Not Found');
            if(userId !== task.userId)throw new ForbiddenException('Access denied');
    }
}