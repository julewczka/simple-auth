import {Express, Request, Response} from "express";
import {Database} from "../database/database";

export const editEndpoint = (app: Express, db: Database) => {
    const isUserGroup = (body: any) => 'group_name' in body && 'usergroup_id' in body;
    const invalidMsg = 'invalid body data';

    app.get('/usergroups-list', async (req: Request, res: Response) => {
        if (isUserGroup(req.body)) {
            const users = await db.getUserFromUserGroup(req.body.group_name);
            res.send(users);
        } else {
            res.send(invalidMsg);
        }
    })

    app.get('/permission-list', async (req: Request, res: Response) => {
        if (isUserGroup(req.body)) {
            const permissions = await db.getPermissionsFromUserGroup(req.body.group_name);
            res.send(permissions);
        } else {
            res.send(invalidMsg);
        }
    })


    app.post('/add-user', async (req: Request, res: Response) => {
        if (!('username' in req.body && 'usergroup' in req.body)) res.send(400);
        const [user, usergroup] = await Promise.all([db.getUserByUsername(req.body.username), db.getUserGroupByName(req.body.usergroup)]);
        if (!user.user_id || !usergroup.usergroup_id) res.send('User or usergroup not found');
        const msg = await db.addUserToUserGroup(user, usergroup);
        const message = msg && msg.rowCount > 0 ? `User ${user.username} added to group ${usergroup.group_name}` : `Failed to add ${req.body.username} to ${req.body.usergroup}`;
        res.send(message);
    });

    app.delete('/remove-user', async (req: Request, res: Response) => {
        if (!('username' in req.body && 'usergroup' in req.body)) res.send(400);
        const [user, usergroup] = await Promise.all([db.getUserByUsername(req.body.username), db.getUserGroupByName(req.body.usergroup)]);
        if (!user.user_id || !usergroup.usergroup_id) res.send('User or usergroup not found');
        const msg = await db.removeUserFromUserGroup(user, usergroup);
        const message = msg && msg.rowCount > 0 ? `User ${user.username} removed from ${usergroup.group_name}` : 'Removing user failed';
        res.send(message);
    });

    app.post('/add-permission', async (req: Request, res: Response) => {
        if (!('permission' in req.body && 'usergroup' in req.body)) res.send(400);
        const [permission, usergroup] = await Promise.all([db.getPermissionByName(req.body.permission), db.getUserGroupByName(req.body.usergroup)]);
        if (!permission.permission_id || !usergroup.usergroup_id) res.send('Permission or usergroup not found');
        const msg = await db.addPermissionToUserGroup(usergroup,permission);
        const message = msg && msg.rowCount > 0 ? `Permission ${permission.permission_name} added to group ${usergroup.group_name}` : `Failed to add ${req.body.permission} to ${req.body.usergroup}`;
        res.send(message);
    });

    app.delete('/remove-permission', async (req: Request, res: Response) => {
        if (!('permission' in req.body && 'usergroup' in req.body)) res.send(400);
        const [permission, usergroup] = await Promise.all([db.getPermissionByName(req.body.permission), db.getUserGroupByName(req.body.usergroup)]);
        if (!permission.permission_id || !usergroup.usergroup_id) res.send('Permission or usergroup not found');
        const msg = await db.removePermissionFromUserGroup(usergroup,permission);
        const message = msg && msg.rowCount > 0 ? `Permission ${permission.permission_name} removed from ${usergroup.group_name}` : `Remove permission failed`;
        res.send(message);
    });
}