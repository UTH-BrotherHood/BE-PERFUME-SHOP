import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/user.requests'
import usersService from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESSFULLY,
    result
  })
}
