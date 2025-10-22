export class LoginUserEntity {
    token: string;
    constructor(partial: Partial<LoginUserEntity>) {
        Object.assign(this, partial);
    }
}