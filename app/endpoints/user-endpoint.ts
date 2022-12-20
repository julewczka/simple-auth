import {Express, Request, Response} from "express";
import {Database} from "../database/database";
import {User} from "../types/types";

export const userEndpoint = (app: Express, db: Database) => {
    const isUser = (body: any) => 'username' in body && 'password' in body && 'email' in body;

    app.get('/users', async (req: Request, res: Response) => {
        const users = await db.getUsers();
        res.send(users);
    })

    app.post('/user', async (req: Request, res: Response) => {
        let message = '';
        if (isUser(req.body)) {
            const user: User = {
                user_id: req.body.user_id,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };
            const insert = await db.addUser(user);
            message = (insert && insert.rowCount > 0) ?
                `User ${req.body.username} added` : 'Adding user failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);
    });

    app.put('/user', async (req: Request, res: Response) => {
        let message = '';
        if (isUser(req.body)) {
            const user: User = {
                user_id: req.body.user_id,
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            };
            const update = await db.updateUser(user);
            message = (update && update.rowCount > 0) ?
                `User ${req.body.username} updated` : 'Updating user failed';

        } else {
            message = 'invalid body data';
        }

        res.send(message);
    });

    app.delete('/user/:id', async (req: Request, res: Response) => {
        const del = await db.deleteUser(req.params.id);
        const message = del && del.rowCount > 0 ? 'User deleted' : 'Deleting user failed';
        res.send(message);
    })
}