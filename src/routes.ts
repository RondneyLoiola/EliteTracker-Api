import { Router } from "express";
import HabitsController from "./app/controllers/habitsController";

const router = Router();

const habitsController = new HabitsController()

router.get('/health', (_req, res) => {
    return res.status(200).json({
        mensage: 'ok'
    })
})

router.post('/habits', habitsController.store)
router.get('/habits', habitsController.index)
router.delete('/habits/:id', habitsController.delete)

export default router