import express from 'express'
import { listCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categories.js'

const router = express.Router()

router.get('/', listCategories)
router.post('/', addCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router 