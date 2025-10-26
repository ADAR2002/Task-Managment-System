
export class CreateCommentsEntity {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CreateCommentsEntity>) {
        Object.assign(this, partial);
    }
}