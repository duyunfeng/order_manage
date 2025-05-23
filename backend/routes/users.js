import { Router } from 'express'
import * as usersController from '../controllers/users.js'
import { requireAuth, canEditUser, onlyFrontend } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, usersController.listUsers)
router.post('/', usersController.createOrLoginUser)
router.get('/:id', requireAuth, usersController.getUserById)
router.put('/:id', requireAuth, canEditUser, usersController.updateUser)
router.delete('/:id', requireAuth, canEditUser, usersController.deleteUser)

export default router 