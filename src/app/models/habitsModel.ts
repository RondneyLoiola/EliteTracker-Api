import { Schema, model } from "mongoose";

const HabitSchema = new Schema(
    {
        name: String,
        completedDates: [Date], //array de datas
        userId: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const habitModel = model("Habit", HabitSchema);