import { Router } from 'express'
import {} from '~/controllers/carts.controllers'
import {
  createOrdercontroller,
  getAllOrderscontroller,
  getOrderDetailcontroller
} from '~/controllers/orders.controllers'
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

/**
 * Description: get all orders
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
ordersRouters.get('/', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(getAllOrderscontroller))

/**
 * Description: get order detail
 * Path: /:order_id
 * Method: POST
 * Header: {Authorization: Bearer token}
 */
ordersRouters.get(
  '/:order_id',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(getOrderDetailcontroller)
)

export default ordersRouters
