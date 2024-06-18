import { checkSchema } from 'express-validator'
import { ORDERS_MESSAGES } from '~/constants/messages'
import categoriesService from '~/services/categories.services'
import { validate } from '~/utils/validation.utils'

export const createOrderValidation = validate(
  checkSchema(
    {
      address_id: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.ADDRESS_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ORDERS_MESSAGES.ADDRESS_ID_MUST_BE_STRING
        }
        // custom: {
        //   options: async (value, { req }) => {
        //     const isCategoryExist = await categoriesService.checkCategoryExistByName(value)
        //     if (isCategoryExist) {
        //       throw new Error(CATEGORY_MESSAGES.CATEGORY_ALREADY_EXIST)
        //     }
        //     return !isCategoryExist
        //   }
        // }
      },
      payment_id: {
        notEmpty: {
          errorMessage: ORDERS_MESSAGES.PAYMENT_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ORDERS_MESSAGES.PAYMENT_ID_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)
