import { Router } from "express";
import HabitsController from "./app/controllers/habitsController";
import FocusTimeController from "./app/controllers/focusTimeController";

const router = Router();

const habitsController = new HabitsController()
const focusTimeController = new FocusTimeController()

router.get('/health', (_req, res) => {
    return res.status(200).json({
        mensage: 'ok'
    })
})

router.post('/habits', habitsController.store)
router.get('/habits', habitsController.index)
router.delete('/habits/:id', habitsController.delete)
router.patch('/habits/:id/toggle', habitsController.toggle)

router.post('/focus-time', focusTimeController.store)

export default router