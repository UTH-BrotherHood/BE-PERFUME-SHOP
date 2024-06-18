import { Router } from 'express'
import { createPaymentMethodcontroller } from '~/controllers/payments.controllers'
import { createPaymentMethodValidation } from '~/middlewares/payments.middleware'
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
  createPaymentMethodValidation,
  wrapRequestHandler(createPaymentMethodcontroller)
)

export default paymentRouters
