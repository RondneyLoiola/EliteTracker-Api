import 'dotenv/config'
import cors from 'cors'

import express from 'express';
import router from './routes';
import { setupMongo } from './database';

const app = express();

setupMongo().then(() => {
    app.use(cors({
        origin: '*'
    }))
    app.use(express.json());
    
    app.use(router)

    const PORT = process.env.PORT || 4000; // ← Mudança aqui

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    })
}).catch((err) => {
    console.log('❌ Unable to connect to the database.', err)
})