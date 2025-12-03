import mongoose from "mongoose";

export async function setupMongo(){
    try {
        if(mongoose.connection.readyState === 1){
            return
        }

        console.log('✅ Conectando ao banco de dados...')
        await mongoose.connect('mongodb://localhost:27017/eliteTracker', {
            serverSelectionTimeoutMS: 5000
        })
    } catch (_error) {
        throw new Error("❌ Não foi possível conectar ao banco de dados")
    }
}