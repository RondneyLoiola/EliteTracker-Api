import type { Request, Response } from "express";
import { habitModel } from "../models/habitsModel"
import { z } from 'zod'
import { buildValidationErrorMessage } from "../../utils/buildValidationErrorMessage";
import dayjs from "dayjs";
import mongoose from "mongoose";

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
            completedDates: [],
            userId: req.user.id
        })

        return res.status(201).json(newHabit)
    }

    index = async (req: Request, res: Response): Promise<Response> => {
        const habits = await habitModel.find({
            userId: req.user.id //busca os habitos do user
        }).sort({ name: 1 })

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

        const findHabit = await habitModel.findOne({
            _id: habit.data.id,
            userId: req.user.id
        })

        if (!findHabit) {
            return res.status(404).json({
                message: 'Habit not found'
            })
        }

        await habitModel.deleteOne({
            _id: habit.data.id
        })

        return res.status(204).json({ message: 'Habit deleted successfully!' })
    }

    toggle = async (req: Request, res: Response) => {
        const schema = z.object({
            id: z.string()
        })

        const validated = schema.safeParse(req.params)

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        const findHabit = await habitModel.findOne({
            _id: validated.data.id,
            userId: req.user.id
        })

        if (!findHabit) {
            return res.status(404).json({
                message: 'Habit not found'
            })
        }

        const now = dayjs().startOf('day').toISOString(); //começo do dia

        //toObject para transformar em array
        const isHabitCompletedOnDate = findHabit
            .toObject()
            ?.completedDates.find(
                (item) => dayjs(String(item)).toISOString() === now
            )

        if (isHabitCompletedOnDate) {
            const habitUpdated = await habitModel.findOneAndUpdate(
                {
                    _id: validated.data.id //where
                },
                {
                    $pull: { //remove o now de completedDates
                        completedDates: now
                    }
                },
                {
                    returnDocument: 'after' //retorna o documento depois do updated
                }
            )

            return res.json(habitUpdated)
        }

        const habitUpdated = await habitModel.findOneAndUpdate(
            {
                _id: validated.data.id //where
            },
            {
                $push: { //coloca o now de completedDates
                    completedDates: now
                }
            },
            {
                returnDocument: 'after' //retorna o documento depois do updated
            }
        )

        return res.json(habitUpdated)
    }

    metrics = async (req: Request, res: Response) => {
        const schema = z.object({
            id: z.string(), //vem do req.params
            date: z.coerce.date() //vem do req.query
        })

        const validated = schema.safeParse({ ...req.params, ...req.query })
        //pega tudo que vem do req.params e req.query e transforma em um objeto
        //transforma o id e date em um objeto

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        //transformando em data, pois o mongoose aceita apenas data
        const dateFrom = dayjs(validated.data.date).startOf('month')//pega o primeiro dia do mes
        const dateTo = dayjs(validated.data.date).endOf('month')//pega o ultimo dia do mes

        //console.log(dateTo.diff(dateFrom, 'days') + 1) 

        //destruturado em array
        const [habitMetrics] = await habitModel.aggregate().match({
            _id: new mongoose.Types.ObjectId(validated.data.id),
            userId: req.user.id
        }).project({
            _id: 1,
            name: 1,
            completedDates: {
                $filter: {
                    input: '$completedDates',
                    as: 'completedDate',
                    cond: {
                        $and: [
                            {
                                $gte: ['$$completedDate', dateFrom.toDate()]
                            },
                            {
                                $lte: ['$$completedDate', dateTo.toDate()]
                            }
                        ]
                    }
                }
            }
        })

        if(!habitMetrics) {
            return res.status(404).json({message: 'Habit not found'})
        }

        return res.status(200).json(habitMetrics)
    }
}

export default HabitsController