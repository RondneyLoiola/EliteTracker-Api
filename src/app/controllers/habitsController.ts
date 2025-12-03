import type { Request, Response } from "express";
import { habitModel } from "../models/habitsModel";

class HabitsController {
    store = async (req: Request, res: Response): Promise<Response> => {
        const { name } = req.body

        const findHabit = await habitModel.findOne({ name })

        if(findHabit) {
            return res.status(400).json({
                mensage: 'Habit already exists!'
            })
        }

        const newHabit = await habitModel.create({
            name,
            completedDates: []
        })

        return res.status(201).json(newHabit)
    }
}

export default HabitsController