import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import usersService from '~/services/users.services'

export const registerController = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    console.log(userData)
    if (!userData || !userData.username || !userData.password) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const result = await usersService.register(userData)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESSFULLY,
      result
    })
  } catch (error) {
    console.error('Error during user registration:', error)
    return res.status(500).json({
      message: USERS_MESSAGES.REGISTER_FAILED,
      error: 'error.message'
    })
  }
}
