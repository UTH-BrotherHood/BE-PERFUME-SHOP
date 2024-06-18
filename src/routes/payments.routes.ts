import { Router } from 'express'
import { createPaymentMethodcontroller } from '~/controllers/payments.controllers'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const paymentRouters = Router()

/**
 * Description: create a new payment method
 * Path: /
 * Method: POST
 * Body : payment_method
 * Header: {Authorization: Bearer token}
 */
paymentRouters.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(createPaymentMethodcontroller)
)

export default paymentRouters
