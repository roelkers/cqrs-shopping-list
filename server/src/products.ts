import { Router, Request, Response, NextFunction } from 'express'
import pgClient from './pgClient'
const router = Router()

router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
    const data = await pgClient.query('SELECT id, category, product_name FROM products;')
    return res.json({ data: data.rows})
})


router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
    const { category, name } = req.body
    await pgClient.query('INSERT INTO products(category, product_name) VALUES($1,$2)', [category, name])
    res.sendStatus(200)
})

export default router