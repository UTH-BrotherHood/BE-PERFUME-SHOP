import { Pool } from 'pg'
import { config } from 'dotenv'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import Category from '~/models/schemas/category.schemas'
import { CategoryReqBody } from '~/models/requests/category.requests'
import Product from '~/models/schemas/product.shemas'
import { ProductReqBody, UpdateProductReqBody } from '~/models/requests/product.requests'
config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

class ProductsService {
  async checkProductExistByName(name: string) {
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

  async getProducts(limit: number, page: number) {
    const offset = (page - 1) * limit

    const productsResult = await databaseServices.query(
      `SELECT *
       FROM products
       LIMIT $1
       OFFSET $2`,
      [limit, offset]
    )

    const totalResult = await databaseServices.query(
      `SELECT COUNT(*) AS total
       FROM products`
    )

    return {
      products: productsResult.rows,
      total: parseInt(totalResult.rows[0].total, 10)
    }
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

  async updateProduct(product_id: string, payload: UpdateProductReqBody) {
    // Lấy thông tin hiện tại của sản phẩm
    const currentProduct = await databaseServices.query(`SELECT * FROM products WHERE id = $1`, [product_id])

    if (currentProduct.rows.length === 0) {
      throw new Error('Product not found')
    }

    const product = currentProduct.rows[0]

    // Cập nhật các trường chỉ nếu chúng có giá trị trong payload
    const updatedProduct = {
      name: payload.name !== undefined ? payload.name : product.name,
      description: payload.description !== undefined ? payload.description : product.description,
      discount: payload.discount !== undefined ? payload.discount : product.discount,
      images: payload.images !== undefined ? payload.images : product.images,
      stock: payload.stock !== undefined ? payload.stock : product.stock,
      price: payload.price !== undefined ? payload.price : product.price
    }

    await databaseServices.query(
      `UPDATE products
         SET 
             name = $1,
             description = $2,
             discount = $3,
             images = $4,
             stock = $5,
             price = $6,
             updated_at = NOW()
         WHERE id = $7`,
      [
        updatedProduct.name,
        updatedProduct.description,
        updatedProduct.discount,
        updatedProduct.images,
        updatedProduct.stock,
        updatedProduct.price,
        product_id
      ]
    )

    const product_just_updated = await databaseServices.query(
      `SELECT *
         FROM products
         WHERE id = $1`,
      [product_id]
    )

    return product_just_updated.rows[0]
  }
}
const productsService = new ProductsService()

export default productsService
