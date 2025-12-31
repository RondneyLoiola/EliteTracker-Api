import type { Response, Request } from "express";
import { z } from 'zod'
import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

import { buildValidationErrorMessage } from "../../utils/buildValidationErrorMessage";
import { focusTimeModel } from "../models/focusTimeModel";

class FocusTimeController{
    store = async (req: Request, res: Response) => {
        const schema = z.object({
            timeFrom: z.coerce.date(), //coerce transforma em data, em um tipo Date
            timeTo: z.coerce.date()
        })

        const focusTime = schema.safeParse(req.body)

        if (!focusTime.success) {
            const errors = buildValidationErrorMessage(focusTime.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        const timeFrom = dayjs(focusTime.data.timeFrom)
        const timeTo = dayjs(focusTime.data.timeTo)

        //vê se o timeTo é antes do timeFrom
        const isTimeToBeforeTimeFrom = timeTo.isBefore(timeFrom)

        if(isTimeToBeforeTimeFrom) {
            return res.status(400).json({
                message: 'timeTo cannot be in the past!'
            })
        }

        const createdFocusTime = await focusTimeModel.create({
            timeFrom: timeFrom.toDate(), //transforma em Date
            timeTo: timeTo.toDate(), //transforma em Date,
            userId: req.user.id
        })

        return res.status(201).json(createdFocusTime)
    }

    index = async (req: Request, res: Response) => {
        const schema = z.object({
            date: z.coerce.date()
        })

        const validated = schema.safeParse(req.query)

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        // Força o uso do UTC para evitar problemas de fuso horário
        const startDate = dayjs.utc(validated.data.date).startOf('day')
        const endDate = dayjs.utc(validated.data.date).endOf('day')

        const focusTimes = await focusTimeModel.find({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            },
            userId: req.user.id
        }).sort({
            timeFrom: 1
        })

        return res.status(200).json(focusTimes)
    }

    metricsByMonth = async (req: Request, res: Response) => {
        const schema = z.object({
            date: z.coerce.date()
        })

        const validated = schema.safeParse(req.query)

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        // Também use UTC aqui
        const startDate = dayjs.utc(validated.data.date).startOf('month')
        const endDate = dayjs.utc(validated.data.date).endOf('month')

        const focusTimeMetrics = await focusTimeModel.aggregate().match({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            },
            userId: req.user.id
        }).project({
            year: {
                $year: '$timeFrom'
            },
            month: {
                $month: '$timeFrom'
            },
            day: {
                $dayOfMonth: '$timeFrom'
            }
        }).group({
            _id: ['$year', '$month', '$day'],
            count: {
                $sum: 1
            }
        }).sort({
            _id: 1
        })

        return res.status(200).json(focusTimeMetrics)
    }
}

export default FocusTimeController