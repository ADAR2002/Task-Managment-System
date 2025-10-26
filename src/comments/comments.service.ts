import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
    addComment():String {
        return "Add Comment";
    }
    //-------------------------------------------------------------------------------------------------
    editComment():String {
        return "edit Comment";
    }
    //-------------------------------------------------------------------------------------------------
   
    removeComment():String {
        return "remove Comment";
    }
    //-------------------------------------------------------------------------------------------------
   
    getComments():String {
        return "get Comment";
    }

}
