import {NextFunction, Request, Response} from "express";
import {validateToken} from "../endpoints/loginEndpoint";

export const checkRequestToken = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (header && header.toLocaleLowerCase().includes('basic') && req.originalUrl === '/login') {
        next();
        return;
    } else if (!header || !header.toLowerCase().includes('bearer')) {
        res.sendStatus(401);
        return;
    }

    const bearer = header.split(" ");
    const bearerToken = bearer[1];

    if (validateToken(bearerToken)) {
        next();
    } else {
        res.sendStatus(401);
    }

}