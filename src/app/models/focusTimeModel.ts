import {Schema, model} from 'mongoose';

const FocusTimeSchema = new Schema(
    {
        typeFrom: { //quando o tempo começa
            type: Date,
            required: true
        },
        timeTo: { //quando o tempo termina
            type: Date,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export const focusTimeModel = model('FocusTime', FocusTimeSchema);