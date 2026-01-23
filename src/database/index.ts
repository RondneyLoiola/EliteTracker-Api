// src/database/index.ts
import mongoose from 'mongoose';

export async function setupMongo() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não está definida');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}