import {Schema, model} from 'mongoose';
import { required } from 'zod/mini';

const FocusTimeSchema = new Schema(
    {
        timeFrom: Date, //quando o tempo começa
        timeTo: Date, //quando o tempo termina
        userId: String
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export const focusTimeModel = model('FocusTime', FocusTimeSchema); 