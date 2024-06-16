import { userVerificationStatus } from '~/constants/enums'

interface CategoryType {
  id?: string
  name: string
  description: string
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  id?: string
  name: string
  description: string
  created_at?: Date
  updated_at?: Date
  constructor(Category: CategoryType) {
    const date = new Date()
    this.id = Category.id
    this.name = Category.name || ''
    this.description = Category.description || ''
    this.created_at = Category.created_at || date
    this.updated_at = Category.updated_at || date
  }
}
