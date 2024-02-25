import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET_KEY: any = process.env.JWT_SECRET_KEY;

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware function to verify access token
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(403).json({ message: "Your token expired, Please login again" });
    }

    const auth = jwt.verify(token, JWT_SECRET_KEY as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: "Your token expired, Please login again" });
        }
        req.user = user;
        next();
    });
};
