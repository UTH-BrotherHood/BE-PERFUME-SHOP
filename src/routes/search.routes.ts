import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidation } from '~/middlewares/search.middlewares'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRouters = Router()

/**
 * Description: Search for tweets
 * Path: /
 * Method: POST
 * Body : { tweet_id : string}
 * Header: {Authorization: Bearer token}
 */
searchRouters.get('/', verifiedUserValidation, searchValidation, wrapRequestHandler(searchController))

export default searchRouters
