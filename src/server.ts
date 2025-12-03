import express from 'express';
import router from './routes';
import { setupMongo } from './database';

const app = express();

setupMongo().then(() => {
    app.use(express.json());
    app.use(router)

    app.listen(4000, () => {
        console.log('🚀 Server running on port 4000');
    })
}).catch(() => console.log('❌ Não foi possível conectar ao banco de dados'))



