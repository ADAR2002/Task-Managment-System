
export class CreateTaskEntity {
    id: number;
    title: string;
    description: string | null;
    status: string;
    userId: number;
    constructor(partial: Partial<CreateTaskEntity>) {
        Object.assign(this, partial);
    }
}