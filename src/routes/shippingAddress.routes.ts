import { Router } from 'express'
import {
  createShippingAddressController,
  getShippingAddressController,
  getShippingAddressDetailsController,
  updateShippingAddressController
} from '~/controllers/shippingAddress.controllers'
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

/*
Description: Update shipping address
Path: /:address_id
Headers: { Authorization : Bearer <accessToken> }
Method: PATCH
Body : ShippingAddressReqBody
*/
shippingAddressRouters.patch('/:address_id', accessTokenValidation, wrapRequestHandler(updateShippingAddressController))

/*
Description: get shipping address details
Path: /:address_id
Headers: { Authorization : Bearer <accessToken> }
Method: get
*/
shippingAddressRouters.get(
  '/:address_id',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(getShippingAddressDetailsController)
)

/*
Description: get all shipping address
Path: /
Headers: { Authorization : Bearer <accessToken> }
Method: get
*/
shippingAddressRouters.get(
  '/',
  accessTokenValidation,
  verifiedUserValidation,
  wrapRequestHandler(getShippingAddressController)
)

export default shippingAddressRouters
