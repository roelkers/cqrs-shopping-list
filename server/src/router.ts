import { Router } from 'express'
import events from './events'
import products from './products'

const router = Router()

router.use(events)
router.use(products)

export default router