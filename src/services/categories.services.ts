import { Pool } from 'pg'
import { config } from 'dotenv'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import Category from '~/models/schemas/category.schemas'
import { CategoryReqBody } from '~/models/requests/category.requests'
config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

class CategoriesService {
  async checkCategoryExist(name: string) {
    const result = await databaseServices.query(
      `SELECT name FROM category
        WHERE name = $1;`,
      [name]
    )
    return Boolean(result.rows.length)
  }
  async creatCategory(payload: CategoryReqBody) {
    const category_id = uuidv4()

    const category = new Category({
      ...payload
    })

    await databaseServices.query(
      `INSERT INTO category (id, name, description)
      VALUES ($1, $2, $3)`,
      [category_id, category.name || '', category.description || '']
    )

    const category_just_created = await databaseServices.query(
      `SELECT *
       FROM category
       WHERE id = $1`,
      [category_id]
    )

    return category_just_created.rows[0]
  }
}
const categoriesService = new CategoriesService()

export default categoriesService
