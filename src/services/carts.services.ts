import { ErrorWithStatus } from '~/models/errors'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'

class CartsService {
  async addToCart({ user_id, product_id, quantity }: { user_id: string; product_id: string; quantity: number }) {
    const cart_id = uuidv4()

    const checkProductExist = await databaseServices.query(
      `SELECT quantity
       FROM carts 
       WHERE product_id = $1 AND user_id = $2;`,
      [product_id, user_id]
    )

    if (checkProductExist.rows.length > 0) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      const newQuantity = checkProductExist.rows[0].quantity + quantity
      const result = await databaseServices.query(
        `UPDATE carts
         SET quantity = $1, updated_at = NOW()
         WHERE product_id = $2 AND user_id = $3
         RETURNING *;`,
        [newQuantity, product_id, user_id]
      )
      return result.rows[0]
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm vào giỏ hàng
      const result = await databaseServices.query(
        `INSERT INTO carts (id, user_id, product_id, quantity, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *;`,
        [cart_id, user_id, product_id, quantity]
      )
      return result.rows[0]
    }
  }

  async deleteFromCart({ user_id, product_id }: { user_id: string; product_id: string }) {
    const checkProductExist = await databaseServices.query(
      `SELECT 
        EXISTS(
          SELECT 
            1 
          FROM
            carts 
          WHERE 
            product_id = $1 and user_id = $2
        );`,
      [product_id, user_id]
    )
    if (!checkProductExist.rows[0].exists) {
      throw new ErrorWithStatus({
        status: 404,
        message: 'Product not found in cart or already deleted'
      })
    }
    const result = await databaseServices.query(
      `DELETE FROM carts
       WHERE product_id = $1 AND user_id = $2
       RETURNING *;`,
      [product_id, user_id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }

  async changeQuantityOfProductInCart({
    user_id,
    product_id,
    quantity
  }: {
    user_id: string
    product_id: string
    quantity: number
  }) {
    const checkProductExist = await databaseServices.query(
      `SELECT quantity
       FROM carts 
       WHERE product_id = $1 AND user_id = $2;`,
      [product_id, user_id]
    )

    if (checkProductExist.rows.length === 0) {
      throw new ErrorWithStatus({
        status: 404,
        message: 'Product not found in cart or already deleted'
      })
    }

    const result = await databaseServices.query(
      `UPDATE carts
       SET quantity = $1, updated_at = NOW()
       WHERE product_id = $2 AND user_id = $3
       RETURNING *;`,
      [quantity, product_id, user_id]
    )

    return result.rows[0]
  }

  async getCart({ user_id }: { user_id: string }) {
    const result = await databaseServices.query(
      `SELECT 
        products.id, 
        products.name, 
        products.price, 
        products.discount, 
        products.stock, 
        carts.quantity
      FROM 
        carts 
      JOIN 
        products 
      ON 
        carts.product_id = products.id
      WHERE 
        user_id = $1;`,
      [user_id]
    )

    return result.rows
  }
}

const cartsService = new CartsService()
export default cartsService
