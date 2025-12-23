import mongoose from "mongoose";

const { MONGO_URL: mongoUrl } = process.env

export async function setupMongo() {
    try {
        if (mongoose.connection.readyState === 1) {
            return
        }

        console.log('Conectando ao banco de dados...')
        await mongoose.connect(String(mongoUrl), {
            serverSelectionTimeoutMS: 5000
        })
        console.log('✅ Conectado ao banco de dados')
    } catch (_error) {
        throw new Error("❌ Não foi possível conectar ao banco de dados")
    }
}