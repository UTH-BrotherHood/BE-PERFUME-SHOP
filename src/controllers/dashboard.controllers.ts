import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import dashboardService from '~/services/dashboard.services'

export const getDashboardDatacontroller = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const result = await dashboardService.getCategory()
  return res.json({
    message: CATEGORY_MESSAGES.GET_CATEGORY_SUCCESSFULLY,
    result
  })
}
