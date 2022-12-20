export interface User {
    user_id: number;
    username: string;
    password: string;
    email: string;

}

export interface UserGroup {
    usergroup_id: number;
    group_name: string;
}

export interface Permission {
    permission_id: number;
    permission_name: string;
}

export interface TokenCache {
    token: string;
    valid: number;
}