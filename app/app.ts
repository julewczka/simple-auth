import express, { Request, Response} from 'express';
import {Database} from './database/database';
import {userEndpoint} from './endpoints/user-endpoint';
import {userGroupEndpoint} from './endpoints/usergroups-endpoint';
import {permissionsEndpoint} from "./endpoints/permissions-endpoint";
import {editEndpoint} from "./endpoints/edit-endpoint";
import {loginEndpoint, getTokenList, validateToken} from "./endpoints/loginEndpoint";
import {checkRequestToken} from "./middlewares/auth";

const app = express();
const port = 3000;
const db = new Database();

app.use(express.json());


app.use(checkRequestToken);


loginEndpoint(app,db);
userEndpoint(app, db);
userGroupEndpoint(app,db);
permissionsEndpoint(app,db);
editEndpoint(app,db);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})