import { Router, Request, Response, NextFunction } from 'express'
import pgClient from './pgClient'
const router = Router()

router.get('/lists', async (req: Request, res: Response, next: NextFunction) => {
    const data = await pgClient.query('SELECT id FROM shopping_lists;')
    return res.json({ data: data.rows})
})


router.post('/lists', async (req: Request, res: Response, next: NextFunction) => {
})

export default router