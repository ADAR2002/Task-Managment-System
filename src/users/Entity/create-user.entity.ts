import { Exclude } from 'class-transformer';

export class CreateUserEntity {
    id: number;
    name: string | null ;
    email: string;
    @Exclude()
    password: string;
    constructor(partial: Partial<CreateUserEntity>) {
        Object.assign(this, partial);
    }
}