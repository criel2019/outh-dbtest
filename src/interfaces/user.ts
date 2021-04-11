export interface IMongoDBUser {
    googleId?: string;
    kakaoId?: string;
    naverId?: string;
    username: string;
    email: Array<string>;
    __v: number;
    _id: string;
}