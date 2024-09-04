import { Router } from 'express'
import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    udpateProductController,
    deleteProductController
} from '../controllers/product.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getAllProductsController)
router.get('/:pid', handlePolicies(['USER', 'ADMIN']), getProductByIdController)
router.post('/', handlePolicies(['PREMIUM']), createProductController)
router.put('/:pid', handlePolicies(['PREMIUM', 'ADMIN']), udpateProductController)
router.delete('/:pid', handlePolicies(['PREMIUM', 'ADMIN']), deleteProductController)

export default router