import type { Response, Request } from "express";
import { z } from 'zod'
import dayjs from "dayjs";

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
            timeTo: timeTo.toDate() //transforma em Date
        })

        return res.status(201).json(createdFocusTime)
    }

    index = async (req: Request, res: Response) => {
        const schema = z.object({
            date: z.coerce.date()
        })

        const validated = schema.safeParse(req.query)
        //recebe do queryParams

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        const startDate = dayjs(validated.data.date).startOf('month')
        const endDate = dayjs(validated.data.date).endOf('month')

        const focusTimes = await focusTimeModel.find({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            }
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
        //recebe do queryParams

        if (!validated.success) {
            const errors = buildValidationErrorMessage(validated.error.issues)

            return res.status(422).json({
                message: errors
            })
        }

        const startDate = dayjs(validated.data.date).startOf('month')
        const endDate = dayjs(validated.data.date).endOf('month')

        const focusTimeMetrics = await focusTimeModel.aggregate().match({
            timeFrom: {
                $gte: startDate.toDate(),
                $lte: endDate.toDate()
            }
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
            _id: 1 //ordem crescente
        })

        return res.status(200).json(focusTimeMetrics)
    }
}

export default FocusTimeController