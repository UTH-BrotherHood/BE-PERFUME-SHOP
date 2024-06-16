import { Pool } from 'pg'
import { config } from 'dotenv'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import Category from '~/models/schemas/category.schemas'
import { CategoryReqBody } from '~/models/requests/category.requests'
import Product from '~/models/schemas/product.shemas'
import { ProductReqBody } from '~/models/requests/product.requests'
config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

class ProductsService {
  async checkProdcutExistByName(name: string) {
    const result = await databaseServices.query(
      `SELECT 
        EXISTS(
          SELECT 
            1 
          FROM
            products 
          WHERE 
          name = $1
        );`,
      [name]
    )
    const exists = result.rows[0].exists
    return Boolean(exists)
  }

  async checkProdcutExistById(id: string) {
    const result = await databaseServices.query(
      `SELECT 
        EXISTS(
          SELECT 
            1 
          FROM
            products 
          WHERE 
          id = $1
        );`,
      [id]
    )
    const exists = result.rows[0].exists
    return Boolean(exists)
  }

  async createProduct(payload: ProductReqBody) {
    const product_id = uuidv4()

    const product = new Product({
      ...payload
    })

    await databaseServices.query(
      `INSERT INTO products (id, category_id, name, description, discount, images, stock, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        product_id,
        product.category_id,
        product.name,
        product.description || '',
        product.discount || 0,
        product.images || [],
        product.stock || 0,
        product.price || 0
      ]
    )

    const category_just_created = await databaseServices.query(
      `SELECT *
       FROM category
       WHERE id = $1`,
      [product_id]
    )

    return category_just_created.rows[0]
  }

  async deleteProduct(product_id: string) {
    await databaseServices.query(
      `DELETE FROM products
       WHERE id = $1`,
      [product_id]
    )
  }

  async getProducts() {
    const result = await databaseServices.query(
      `SELECT *
       FROM products`
    )
    return result.rows
  }

  async getProduct(product_id: string) {
    const result = await databaseServices.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [product_id]
    )
    return result.rows[0]
  }
}
const productsService = new ProductsService()

export default productsService
