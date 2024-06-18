import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { PaymentMethodReqBody } from '~/models/requests/payment.request'
import { TokenPayload } from '~/models/requests/user.requests'
import paymentsService from '~/services/payments.services'
import { PAYMENTS_MESSAGES } from '~/constants/messages'

export const createPaymentMethodcontroller = async (
  req: Request<ParamsDictionary, any, PaymentMethodReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { payment_method } = req.body

  const result = await paymentsService.createPaymentMethod(user_id, payment_method)

  return res.json({
    message: PAYMENTS_MESSAGES.CREATE_PAYMENT_METHOD_SUCCESSFULLY,
    result
  })
}
