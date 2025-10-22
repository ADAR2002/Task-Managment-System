export class LoginUserEntity {
    accessToken: string;
    refreshToken: string;
    constructor(partial: Partial<LoginUserEntity>) {
        Object.assign(this, partial);
    }
}