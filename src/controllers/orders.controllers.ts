import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { ORDERS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/user.requests'
import ordersService from '~/services/orders.services'
import { OrderReqBody } from '~/models/requests/order.request'

export const createOrdercontroller = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { address_id, payment_id } = req.body

  const result = await ordersService.createOrder({ user_id, address_id, payment_id })

  return res.json({
    message: ORDERS_MESSAGES.CREATE_ORDER_SUCCESSFULLY,
    result
  })
}
