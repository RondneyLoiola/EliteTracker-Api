import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { User } from "../../@types/user.type";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization

    if (!authToken) {
        return res.status(401).json({ message: 'Token not provided!' })
    }

    const token = authToken.split(' ')[1]

    try {
        jwt.verify(String(token), String(process.env.JWT_SECRET), (err, decoded) => {
        if (err) {
            throw new Error()
        }
        req.user = decoded as User;
    })
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid!' })
    }

    return next()
}
