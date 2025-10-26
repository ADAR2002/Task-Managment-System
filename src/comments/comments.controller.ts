import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService:CommentsService){}

    addComments(){
        return this.commentsService.addComment();
    }
    //---------------------------------------------------------------------------------------------------------------------------
    removeComments(){
        return this.commentsService.removeComment();
    }
    //---------------------------------------------------------------------------------------------------------------------------
   
    editComments(){
        return this.commentsService.editComment();
    }
    //---------------------------------------------------------------------------------------------------------------------------
    getComments(){
        return this.commentsService.getComments();
    }

}
