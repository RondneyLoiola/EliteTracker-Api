import mongoose from "mongoose";

const { MONGO_URL: mongoUrl } = process.env

export async function setupMongo() {
    try {
        if (mongoose.connection.readyState === 1) {
            return
        }

        console.log('🎲 Connecting to the database...')
        await mongoose.connect(String(mongoUrl), {
            serverSelectionTimeoutMS: 5000
        })
        console.log('✅ Connected to the database')
    } catch (_error) {
        throw new Error("❌ Unable to connect to the database.")
    }
}