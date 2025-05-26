import { Router } from 'express'
import { toPdf } from '../controllers/convert.js'
const router = Router()
router.post('/to-pdf', toPdf)
export default router 