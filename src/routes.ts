import { Router } from "express";
import HabitsController from "./app/controllers/habitsController";
import FocusTimeController from "./app/controllers/focusTimeController";
import AuthController from "./app/controllers/authController";

const router = Router();

const habitsController = new HabitsController()
const focusTimeController = new FocusTimeController()
const authController = new AuthController()

router.get('/health', (_req, res) => {
    return res.status(200).json({
        mensage: 'ok'
    })
})

router.get('/auth', authController.auth)
router.get('/auth/callback', authController.authCallback)

router.post('/habits', habitsController.store)
router.get('/habits', habitsController.index)
router.get('/habits/:id/metrics', habitsController.metrics)
router.delete('/habits/:id', habitsController.delete)
router.patch('/habits/:id/toggle', habitsController.toggle)

router.post('/focus-time', focusTimeController.store)
router.get('/focus-time', focusTimeController.index)
router.get('/focus-time/metrics', focusTimeController.metricsByMonth)

export default router