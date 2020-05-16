import { Router, Request, Response, NextFunction } from 'express'
import pgClient from './pgClient'
const router = Router()

router.get('/lists', async (req: Request, res: Response, next: NextFunction) => {
    const data = await pgClient.query('SELECT id, name FROM lists;')
    return res.json({ data: data.rows})
})


export default router