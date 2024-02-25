import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const url: any = process.env.MONGO_URL;

export const connectDB = async () => {
    try {
        console.log("URL ", process.env.MONGO_URL)
        await mongoose.connect(url);
        // console.log('Connected to MongoDB');

        mongoose.connection.on('error', (error) => {
            throw new Error(`unable to connect to database`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};