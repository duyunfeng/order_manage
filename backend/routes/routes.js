import express from 'express'
import { listRoutes, addRoute, updateRoute, deleteRoute } from '../controllers/routes.js'

const router = express.Router()

router.get('/', listRoutes)
router.post('/', addRoute)
router.put('/:id', updateRoute)
router.delete('/:id', deleteRoute)

export default router 