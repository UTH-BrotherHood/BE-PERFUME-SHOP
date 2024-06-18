import { checkSchema } from 'express-validator'
import { SHIPPING_ADDRESS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation.utils'

export const createShippingAddress = validate(
  checkSchema(
    {
      full_name: {
        notEmpty: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.FULL_NAME_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.FULL_NAME_MUST_BE_STRING
        }
      },
      phone_number: {
        notEmpty: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.PHONE_NUMBER_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.PHONE_NUMBER_MUST_BE_STRING
        }
      },
      address_line: {
        notEmpty: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.ADDRESS_LINE_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.ADDRESS_LINE_MUST_BE_STRING
        }
      },
      city: {
        notEmpty: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.CITY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.CITY_MUST_BE_STRING
        }
      },
      country: {
        notEmpty: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.COUNTRY_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.COUNTRY_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)

export const updateShippingAddressValidation = validate(
  checkSchema(
    {
      full_name: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.FULL_NAME_MUST_BE_STRING
        }
      },
      phone_number: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.PHONE_NUMBER_MUST_BE_STRING
        }
      },
      address_line: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.ADDRESS_LINE_MUST_BE_STRING
        }
      },
      city: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.CITY_MUST_BE_STRING
        }
      },
      country: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: SHIPPING_ADDRESS_MESSAGES.COUNTRY_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)
