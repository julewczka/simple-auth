import {Express, Request, Response} from "express";
import {Database} from "../database/database";
import { UserGroup} from "../types/types";

export const userGroupEndpoint = (app: Express, db: Database) => {
    const isUserGroup = (body: any) => 'group_name' in body;

    app.get('/usergroups', async (req: Request, res: Response) => {
        const userGroups = await db.getUserGroups();
        res.send(userGroups);
    })

    app.post('/usergroup', async (req: Request, res: Response) => {
        let message = '';
        if (isUserGroup(req.body)) {
            const userGroup: UserGroup = {
                usergroup_id: req.body.usergroup_id,
                group_name: req.body.group_name
            };
            const insert = await db.addUserGroup(userGroup);
            message = (insert && insert.rowCount > 0) ?
            `User group ${req.body.group_name} added` : 'Adding user group failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);
    });

    app.delete('/usergroup/:id', async (req: Request, res: Response) => {
        const msg = await db.deleteUserGroup(req.params.id);
        const message = msg && msg.rowCount > 0 ? `User group deleted` : 'User group failed to delete';
        res.send(message);
    })

    app.put('/usergroup/:id', async (req: Request, res: Response) => {
        let message = '';
        const id = +req.params.id;
        if (isUserGroup(req.body)) {
            const userGroup: UserGroup = {
                usergroup_id: id,
                group_name: req.body.group_name
            };
            const insert = await db.updateUserGroup(req.params.id, userGroup.group_name);
            message = (insert && insert.rowCount > 0) ?
            `Usergroup ${userGroup.group_name} updated` : 'Updating usergroup failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);
    });
}