import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

import User from '../model/user.model';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // Find user by username
        const user: any = await User.findOne({ email }).populate({ path: "role", select: "_id name" });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET_KEY || '1212kasdkjkaj@##@#@3@3',
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the token in the response
        return res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Error logging in' });
    }
}

