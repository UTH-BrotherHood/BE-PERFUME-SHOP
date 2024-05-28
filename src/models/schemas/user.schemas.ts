import { userVerificationStatus } from '~/constants/enums'

interface UserType {
  id?: string
  name: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verification_token?: string
  forgot_password_token?: string
  verify?: userVerificationStatus

  username?: string
  avatar?: string
  cart_id?: string
}

export default class User {
  id?: string
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verification_token: string
  forgot_password_token: string
  verify: userVerificationStatus
  username: string
  avatar: string
  cart_id?: string

  constructor(user: UserType) {
    const date = new Date()
    this.id = user.id
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verification_token = user.email_verification_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || userVerificationStatus.Unverified
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cart_id = user.cart_id
  }
}
