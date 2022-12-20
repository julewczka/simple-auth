import {Pool, Client} from 'pg';
import {Permission, User, UserGroup} from '../types/types';

export class Database {
    private client: Client;
    private pool: Pool;

    constructor() {
        this.client = new Client({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PASSWORD,
            port: parseInt(process.env.PG_PORT!)
        });
        this.pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PASSWORD,
            port: parseInt(process.env.PG_PORT!)
        });
        this.client.connect();
    }

    public getUsers = async (): Promise<User[]> => {
        try {
            const users: User[] = [];
            const query = 'SELECT * FROM AUTH_USER';
            const res = await this.execute(query);
            res.rows.map(user => users.push(user));
            return users;
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }

    public getUserByUsername = async (username: string): Promise<User> => {
        try {
            const query = `SELECT *
                           FROM AUTH_USER
                           WHERE username = '${username}'`;
            const res = await this.execute(query);
            const [user] = res.rows;
            return user ?? {user_id: 0, username: '', password: '', email: ''};
        } catch (e: any) {
            console.log(e.message);
            return {user_id: 0, username: '', password: '', email: ''};
        }
    }

    public addUser = async (user: User) => {
        try {
            const query = `INSERT INTO AUTH_USER (username, password, email)
                           VALUES ('${user.username}', '${user.password}', '${user.email}')`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public updateUser = async (user: User) => {
        try {
            const query = `UPDATE AUTH_USER
                           SET password='${user.password}',
                               email='${user.email}'
                           WHERE username = '${user.username}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public deleteUser = async (id: string | number) => {
        try {
            if (typeof id === 'string') id = +id;
            const query = `DELETE
                           FROM AUTH_USER
                           WHERE user_id = '${id}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public createTables = async () => {
        const res = await this.client.query('');
        console.log(res);
    }

    public getUserGroups = async () => {
        try {
            const userGroups: UserGroup[] = [];
            const query = 'SELECT * FROM AUTH_USERGROUP';
            const res = await this.execute(query);
            res.rows.map(usergroup => userGroups.push(usergroup));
            return userGroups;
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }

    public getUserGroupByName = async (groupname: string): Promise<UserGroup> => {
        try {
            const query = `SELECT *
                           FROM AUTH_USERGROUP
                           WHERE group_name = '${groupname}'`;
            const res = await this.execute(query);
            return res.rows[0] ?? {usergroup_id: 0, group_name: ''};
        } catch (e: any) {
            console.log(e.message);
            return {usergroup_id: 0, group_name: ''};
        }
    }

    public addUserGroup = async (usergroup: UserGroup) => {
        try {
            const query = `INSERT INTO AUTH_USERGROUP (group_name)
                           VALUES ('${usergroup.group_name}')`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public updateUserGroup = async (id: string | number, name: string) => {
        try {
            const query = `UPDATE AUTH_USERGROUP
                           SET group_name='${name}'
                           WHERE usergroup_id = '${id}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public deleteUserGroup = async (id: string | number) => {
        try {
            if (typeof id === 'string') id = +id;
            const query = `DELETE
                           FROM AUTH_USERGROUP
                           WHERE usergroup_id = '${id}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public getPermissions = async () => {
        try {
            const permissions: Permission[] = [];
            const query = 'SELECT * FROM AUTH_PERMISSION';
            const res = await this.execute(query);
            res.rows.map(permission => permissions.push(permission));
            return permissions;
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }

    public getPermissionByName = async (permission_name: string): Promise<Permission> => {
        try {
            const query = `SELECT *
                           FROM AUTH_PERMISSION
                           WHERE permission_name = '${permission_name}'`;
            const res = await this.execute(query);
            return res.rows[0] ?? {permission_id: 0, permission_name: ''};
        } catch (e: any) {
            console.log(e.message);
            return {permission_id: 0, permission_name: ''};
        }
    }

    public addPermission = async (permission: Permission) => {
        try {
            const query = `INSERT INTO AUTH_PERMISSION (permission_name)
                           VALUES ('${permission.permission_name}')`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public updatePermission = async (id: string | number, name: string) => {
        try {
            const query = `UPDATE AUTH_PERMISSION
                           SET permission_name='${name}'
                           WHERE permission_id = '${id}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public deletePermission = async (id: string | number) => {
        try {
            const query = `DELETE
                           FROM AUTH_PERMISSION
                           WHERE permission_id = '${id}'`
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public getUserFromUserGroup = async (userGroup: string): Promise<User[]> => {
        try {
            const users: User[] = [];
            const query = `SELECT *
                           FROM AUTH_USER u
                                    INNER JOIN AUTH_USER_IN_USERGROUPS uiu ON u.username = uiu.username
                           WHERE uiu.usergroup = '${userGroup}'`;
            const res = await this.execute(query);
            res.rows.map(user => users.push(user));
            return users;
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }

    public addUserToUserGroup = async (user: User, userGroup: UserGroup) => {
        try {
            if (user.username === '') return 0;
            const query = `INSERT INTO AUTH_USER_IN_USERGROUPS (username, usergroup)
                           VALUES ('${user.username}', '${userGroup.group_name}')`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public removeUserFromUserGroup = async (user: User, userGroup: UserGroup) => {
        try {
            const query = `DELETE
                           FROM AUTH_USER_IN_USERGROUPS
                           WHERE username = '${user.username}'
                             AND usergroup = '${userGroup.group_name}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public getPermissionsFromUserGroup = async (userGroup: string): Promise<Permission[]> => {
        try {
            const permissions: Permission[] = [];
            console.log(userGroup);
            const query = `SELECT *
                           FROM AUTH_PERMISSION p
                                    INNER JOIN AUTH_GROUPS_PERMISSIONS gp ON p.permission_name = gp.permission
                           WHERE gp.usergroup = '${userGroup}'`;
            const res = await this.execute(query);
            res.rows.map(permission => permissions.push(permission));
            return permissions;
        } catch (e: any) {
            console.log(e.message);
            return [];
        }
    }

    public addPermissionToUserGroup = async (userGroup: UserGroup, permission: Permission) => {
        try {
            const query = `INSERT INTO AUTH_GROUPS_PERMISSIONS (usergroup, permission)
                           VALUES ('${userGroup.group_name}', '${permission.permission_name}')`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public removePermissionFromUserGroup = async (userGroup: UserGroup, permission: Permission) => {
        try {
            const query = `DELETE
                           FROM AUTH_GROUPS_PERMISSIONS
                           WHERE usergroup = '${userGroup.group_name}'
                             AND permission = '${permission.permission_name}'`;
            return await this.execute(query);
        } catch (e: any) {
            console.log(e.message);
        }
    }

    public execute = async (query: string) => {
        return await this.client.query(query);
    }
}