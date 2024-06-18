import { Router } from 'express'
import { createShippingAddressController } from '~/controllers/shippingAddress.controllers'
import { createShippingAddress } from '~/middlewares/shippingAddress.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const shippingAddressRouters = Router()

/**
 * Description: create a new shipping address
 * Path: /
 * Method: POST
 * Body : ShippingAddressReqBody
 * Header: {Authorization: Bearer token}
 */
shippingAddressRouters.post(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  createShippingAddress,
  wrapRequestHandler(createShippingAddressController)
)

export default shippingAddressRouters
