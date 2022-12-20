import {Express, Request, Response} from "express";
import {Database} from "../database/database";
import {Permission} from "../types/types";

export const permissionsEndpoint = (app: Express, db: Database) => {
    const isPermission = (body: any) => 'permission_name' in body;

    app.get('/permissions', async (req: Request, res: Response) => {
        const permissions = await db.getPermissions();
        res.send(permissions);
    })

    app.post('/permission', async (req: Request, res: Response) => {
        let message = '';
        if (isPermission(req.body)) {
            const permission: Permission = {
                permission_id: 0,
                permission_name: req.body.permission_name
            };
            const insert = await db.addPermission(permission);
            message = (insert && insert.rowCount > 0) ?
            `Permission ${req.body.permission_name} added` : 'Adding permission failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);
    });

    app.delete('/permission/:id', async (req: Request, res: Response) => {
        const msg = await db.deletePermission(req.params.id);
        const message = msg && msg.rowCount > 0 ? `Permission deleted` : 'Permission failed to delete';
        res.send(message);
    })

    app.put('/permission/:id', async (req: Request, res: Response) => {
        let message = '';
        const id = +req.params.id;
        if (isPermission(req.body)) {
            const permission: Permission = {
                permission_id: id,
                permission_name: req.body.permission_name
            };
            const insert = await db.updatePermission(req.params.id, permission.permission_name);
            message = (insert && insert.rowCount > 0) ?
                `Permission ${permission.permission_name} updated` : 'updating permission failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);

    });
}