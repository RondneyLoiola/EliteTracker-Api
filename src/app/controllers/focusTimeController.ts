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
}

export default FocusTimeController