import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SHIPPING_ADDRESS_MESSAGES } from '~/constants/messages'
import { ShippingAddressReqBody } from '~/models/requests/shippingAddress.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import shippingAddressService from '~/services/shippingAddress.services'

export const createShippingAddressController = async (
  req: Request<ParamsDictionary, any, ShippingAddressReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { full_name, phone_number, address_line, city, country } = req.body
  const result = await shippingAddressService.createShippingAddress({
    user_id,
    full_name,
    phone_number,
    address_line,
    city,
    country
  })

  return res.json({
    message: SHIPPING_ADDRESS_MESSAGES.CREATE_SHIPPING_ADDRESS_SUCCESSFULLY,
    result
  })
}
