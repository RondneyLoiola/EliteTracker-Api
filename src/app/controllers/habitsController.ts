import type { Request, Response } from "express";
import { habitModel } from "../models/habitsModel";
import { z } from 'zod'
import { buildValidationErrorMessage } from "../../utils/buildValidationErrorMessage";

class HabitsController {
    store = async (req: Request, res: Response): Promise<Response> => {
        const schema = z.object({
            name: z.string().min(1, 'Habit name is required')
        })

        const { name } = req.body

        if (!name) {
            return res.status(400).json({
                message: 'Habit name is required.'
            })
        }

        const habit = schema.safeParse(req.body)
        // se não tiver faltando nada, não quebra o código

        if (!habit.success) {
            const errors = buildValidationErrorMessage(habit.error.issues)

            return res.status(422).json({
                message: errors
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
            completedDates: []
        })

        return res.status(201).json(newHabit)
    }

    index = async (req: Request, res: Response): Promise<Response> => {
        const habits = (await habitModel.find().sort({ name: 1 }))

        return res.status(200).json(habits)
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const schema = z.object({
            id: z.string()
        })

        const habit = schema.safeParse(req.params)

        if (!habit.success) {
            const errors = buildValidationErrorMessage(habit.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        await habitModel.deleteOne({
            _id: habit.data.id
        })

        return res.status(204).json({message: 'Habit deleted successfully!'})
    }
}

export default HabitsController