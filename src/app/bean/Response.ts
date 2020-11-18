import { User } from "../entity/User";

export interface MessageResponse {
    metadata: string;
    code: number;
    data: string;
}

export interface SignUpResponse {
    state: boolean;
    msg: string;
}

export interface SignInResponse {
    jwt: string;
    user: User;
}

export interface UserViewReponse {
    id: number;
    name: string;
    studentId: string;
    email: string;
    concat: string;
    college: string;
    roles: string;
    level: number;
    // 注意，这是userMeta表中的可用性，主要表示黑名单
    enabel: boolean;
}
