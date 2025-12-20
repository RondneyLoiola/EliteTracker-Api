import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization

    if (!authToken) {
        return res.status(401).json({ message: 'Token not provided!' })
    }

    const token = authToken.split(' ')

    jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid!' })
        }

        req.userId = decoded?.id
        next()
    })
}
