import { Router } from 'express'
import { getDashboardDatacontroller } from '~/controllers/dashboard.controllers'
import { accessTokenValidation, verifiedUserValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const dashboardRouters = Router()

/**
 * Description: get dashboard data
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer token}
 */
dashboardRouters.get('/', accessTokenValidation, verifiedUserValidation, wrapRequestHandler(getDashboardDatacontroller))

export default dashboardRouters
