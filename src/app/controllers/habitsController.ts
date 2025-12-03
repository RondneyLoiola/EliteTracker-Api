import type { Request, Response } from "express";
import { habitModel } from "../models/habitsModel";
import { z } from 'zod'

class HabitsController {
    store = async (req: Request, res: Response): Promise<Response> => {
        const schema = z.object({
            name: z.string().min(1, 'Habit name is required'),
            
        })

        const { name } = req.body

        if (!name) {
            return res.status(400).json({
                message: 'Habit name is required.'
            })
        }

        const habit = schema.safeParse({
            name,
            
        })

        if (!habit.success) {
            const errors = habit.error.issues.map(item => {

            })
            return res.status(400).json({
                message: 'Habit must be a string.'
            })
        }

        const findHabit = await habitModel.findOne({
            name: habit.data.name
        })

        if (findHabit) {
            return res.status(400).json({
                mensage: 'Habit already exists!'
            })
        }

        const newHabit = await habitModel.create({
            name: habit.data.name,
            completedDates: [],
        })

        return res.status(201).json(newHabit)
    }
}

export default HabitsController