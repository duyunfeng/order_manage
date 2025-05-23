import { Router } from 'express'
import * as factoriesController from '../controllers/factories.js'

const router = Router()

router.get('/', factoriesController.listFactories)
router.post('/', factoriesController.createFactory)
router.get('/:id', factoriesController.getFactoryById)
router.put('/:id', factoriesController.updateFactory)
router.delete('/:id', factoriesController.deleteFactory)

export default router 