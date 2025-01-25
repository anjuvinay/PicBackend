
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();


const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mongodb:mongodb@cluster0.c1p4y.mongodb.net/picstack';


export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};
