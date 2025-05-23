import { Router } from 'express'
import * as customersController from '../controllers/customers.js'

const router = Router()

router.get('/', customersController.listCustomers)
router.post('/', customersController.createCustomer)
router.get('/:id', customersController.getCustomerById)
router.put('/:id', customersController.updateCustomer)
router.delete('/:id', customersController.deleteCustomer)

export default router 