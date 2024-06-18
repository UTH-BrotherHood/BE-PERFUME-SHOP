import { checkSchema } from 'express-validator'
import { CATEGORY_MESSAGES, PAYMENTS_MESSAGES } from '~/constants/messages'
import categoriesService from '~/services/categories.services'
import { validate } from '~/utils/validation.utils'

export const createPaymentMethodValidation = validate(
  checkSchema(
    {
      payment_method: {
        notEmpty: {
          errorMessage: PAYMENTS_MESSAGES.PAYMENT_METHOD_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: PAYMENTS_MESSAGES.PAYMENT_METHOD_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)

export const categoryIdValidation = validate(
  checkSchema(
    {
      category_id: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_MUST_BE_STRING
        },
        custom: {
          options: async (value) => {
            const isCategoryExist = await categoriesService.checkCategoryExist(value)
            if (!isCategoryExist) {
              throw new Error(CATEGORY_MESSAGES.CATEGORY_NOT_FOUND)
            }
            return isCategoryExist
          }
        }
      }
    },
    ['params']
  )
)
