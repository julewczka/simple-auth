import {Express, Request, Response} from "express";
import {Database} from "../database/database";
import jwt from "jsonwebtoken";
import {TokenCache, User} from "../types/types";

const tokenList: TokenCache[] = [];

export const getTokenList = (): TokenCache[] => {
    return tokenList;
}

const deleteTokenFromList = (token: string) => {
    tokenList.forEach((t, i) => {
        if (t.token === token) {
            tokenList.splice(i, 1);
        }
    })
}

export const validateToken = (passedToken: string): boolean => {
    for (const token of tokenList) {
        if (token.token === passedToken && token.valid > Date.now()) {
            return true;
        } else if (token.token === passedToken && token.valid < Date.now()) {
            deleteTokenFromList(token.token);
            return false;
        }
    }
    return false;
}

export const loginEndpoint = (app: Express, db: Database) => {

    app.post('/login', async (req: Request, res: Response) => {
        const user = await isLoginValid(req.headers);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const token = await generateBearerToken(user);
        res.json({token: token});
    });

    const isLoginValid = async (header: any) => {
        if (!('authorization' in header)) return false;
        if (header.authorization.length < 7) return false;

        const base64string = header.authorization.split(' ')[1];
        const [username, password] = decodeBase64(base64string).split(':');
        const user = await db.getUserByUsername(username);

        if (user.username === username && user.password === password) {
            return user;
        } else {
            return false;
        }
    }


    const decodeBase64 = (data: string) => {
        try {
            return Buffer
                .from(data, 'base64')
                .toString('utf-8');
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    const generateBearerToken = async (user: User | boolean) => {
        if (process.env.SECRET_KEY !== undefined) {
            const token = jwt.sign({user}, process.env.SECRET_KEY);
            const created = Date.now();
            tokenList.push({token: token, valid: created + 3_600_000});
            return token;
        }
    }

}