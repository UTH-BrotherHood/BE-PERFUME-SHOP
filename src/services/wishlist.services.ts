import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'

class WishlistService {
  async addToWishlist(user_id: string, product_id: string) {
    const wish_list_id = uuidv4()

    const checkProductExist = await databaseServices.query(
      `SELECT EXISTS (
          SELECT 1 
          FROM wish_list 
          WHERE product_id = $1 AND user_id = $2
      ) AS "exists";`,
      [product_id, user_id]
    )

    if (checkProductExist.rows[0].exists) {
      throw new Error('Product already exists in wishlist')
    }

    // Thêm sản phẩm vào danh sách yêu thích nếu chưa tồn tại
    const result = await databaseServices.query(
      `INSERT INTO wish_list (wish_list_id, user_id, product_id, updated_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;`,
      [wish_list_id, user_id, product_id]
    )

    return result.rows[0]
  }

  async deleteFromWishlist(user_id: string, product_id: string) {
    const checkProductExist = await databaseServices.query(
      `SELECT 
        EXISTS(
          SELECT 
            1 
          FROM
            wish_list 
          WHERE 
            product_id = $1 and user_id = $2
        );`,
      [product_id, user_id]
    )
    if (!checkProductExist.rows[0].exists) {
      throw new Error('Product not found in wishlist')
    }

    const result = await databaseServices.query(
      `DELETE FROM 
        wish_list 
      WHERE 
        user_id = $1 AND product_id = $2
      RETURNING 
        *;`,
      [user_id, product_id]
    )
    return result.rows[0]
  }

  async getWishlist(user_id: string) {
    const result = await databaseServices.query(
      `SELECT 
        products.id, 
        products.name, 
        products.price, 
        products.discount, 
        products.stock,
        products.images
      FROM 
        wish_list 
      JOIN 
        products 
      ON 
        wish_list.product_id = products.id
      WHERE 
        user_id = $1;`,
      [user_id]
    )

    return result.rows
  }
}

const wishlistService = new WishlistService()
export default wishlistService
