import { Router } from 'express'
import * as goodsController from '../controllers/goods.js'

const router = Router()

router.get('/', goodsController.listGoods)
router.post('/', goodsController.createGood)
router.get('/:id', goodsController.getGoodById)
router.put('/:id', goodsController.updateGood)
router.delete('/:id', goodsController.deleteGood)

export default router 