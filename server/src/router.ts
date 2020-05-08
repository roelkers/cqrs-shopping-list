import { Router } from 'express'
import events from './events'
import products from './products'
import lists from './lists'

const router = Router()

router.use(events)
router.use(products)
router.use(lists)

export default router