import { Router } from 'express'
import {} from '~/controllers/carts.controllers'
import { createOrdercontroller } from '~/controllers/orders.controllers'
import { createOrderValidation } from '~/middlewares/orders.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const ordersRouters = Router()

/**
 * Description: create a order
 * Path: /
 * Method: POST
 * Body : OrderReqBody
 * Header: {Authorization: Bearer token}
 */
ordersRouters.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  createOrderValidation,
  wrapRequestHandler(createOrdercontroller)
)

export default ordersRouters
