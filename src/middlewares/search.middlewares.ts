import { checkSchema } from 'express-validator'
import { SEARCH_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation.utils'

export const searchValidation = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCH_MESSAGES.CONTENT_MUST_BE_A_STRING
        }
      }
    },
    ['query']
  )
)
