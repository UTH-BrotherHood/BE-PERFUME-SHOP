import { ORDERS_MESSAGES } from '~/constants/messages'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import { ErrorWithStatus } from '~/models/errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { error } from 'console'

class OrdersService {
  async createOrder({ user_id, address_id, payment_id }: { user_id: string; address_id: string; payment_id: string }) {
    const order_id = uuidv4()

    // Lấy danh sách sản phẩm trong giỏ hàng
    const productsInCart = await databaseServices.query(`SELECT product_id FROM carts WHERE user_id = $1`, [user_id])
    if (productsInCart.rows.length === 0) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: ORDERS_MESSAGES.CART_IS_EMPTY
      })
    }

    // Lấy danh sách id của các sản phẩm trong giỏ hàng
    const productIds = productsInCart.rows.map((product: any) => product.product_id)

    // Tính tổng giá tiền của các sản phẩm trong giỏ hàng
    const totalPrice = await databaseServices.query(
      `SELECT 
            SUM(products.price * carts.quantity) AS total_price
        FROM 
            carts 
        JOIN 
            products 
        ON 
            carts.product_id = products.id
        WHERE 
            user_id = $1 
            AND carts.product_id = ANY($2);`,
      [user_id, productIds]
    )

    const productsInCartList = await databaseServices.query(
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

    const total_price = Number(totalPrice.rows[0].total_price)

    // Kiểm tra số lượng sản phẩm trong kho
    for (const product of productsInCartList.rows) {
      if (product.quantity > product.stock) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: `${product.name} product is not in sufficient quantity in stock.`
        })
      }
    }

    // Tạo đơn hàng
    const result = await databaseServices.query(
      `INSERT INTO orders (id, user_id, address_id, payment_id, total_price, order_date)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *;`,
      [order_id, user_id, address_id, payment_id, total_price]
    )

    // Tạo các order_item và cập nhật số lượng sản phẩm
    for (const product of productsInCartList.rows) {
      const order_item_id = uuidv4()
      await databaseServices.query(
        `INSERT INTO order_item (id, order_id, product_id, quantity, price, discount)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *;`,
        [order_item_id, order_id, product.id, product.quantity, product.price, product.discount]
      )

      // Cập nhật số lượng sản phẩm trong kho
      await databaseServices.query(
        `UPDATE products
             SET stock = stock - $1
             WHERE id = $2;`,
        [product.quantity, product.id]
      )
    }

    // Xóa sản phẩm trong giỏ hàng
    await databaseServices.query(`DELETE FROM carts WHERE user_id = $1`, [user_id])

    return result.rows[0]
  }

  async getAllOrders(user_id: string) {
    const result = await databaseServices.query(`SELECT * FROM orders WHERE user_id = $1`, [user_id])
    return result.rows
  }

  async getOrderDetail(user_id: string, order_id: string) {
    const result = await databaseServices.query(
      `SELECT 
          o.id AS order_id,
          o.user_id,
          o.payment_id,
          o.total_price,
          o.order_date,
          o.address_id,
          s.full_name AS shipping_full_name,
          s.phone_number AS shipping_phone_number,
          s.address_line AS shipping_address_line,
          s.city AS shipping_city,
          s.country AS shipping_country,
          pmt.payment_method,  
          oi.id AS order_item_id,
          oi.product_id,
          p.name AS product_name,
          p.description AS product_description,
          p.price AS product_price,
          oi.quantity,
          oi.discount
      FROM 
          orders o
      JOIN 
          order_item oi ON o.id = oi.order_id
      JOIN 
          products p ON oi.product_id = p.id
      JOIN 
          shipping_address s ON o.address_id = s.id
      JOIN 
          payment pmt ON o.payment_id = pmt.id 
      WHERE 
          o.user_id = $1 
      AND 
          o.id = $2;
      `,
      [user_id, order_id]
    )
    const rows = result.rows

    if (rows.length === 0) {
      return new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Order not found'
      })
    }

    const orderDetails = {
      order_id: rows[0].order_id,
      user_id: rows[0].user_id,
      payment_id: rows[0].payment_id,
      total_price: rows[0].total_price,
      order_date: rows[0].order_date,
      payment_method: rows[0].payment_method,
      shipping_address: {
        full_name: rows[0].shipping_full_name,
        phone_number: rows[0].shipping_phone_number,
        address_line: rows[0].shipping_address_line,
        city: rows[0].shipping_city,
        country: rows[0].shipping_country
      },
      listProductOfOrder: rows.map((row) => ({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        product_description: row.product_description,
        product_price: row.product_price,
        quantity: row.quantity,
        discount: row.discount
      }))
    }
    return orderDetails
  }
}

const ordersService = new OrdersService()
export default ordersService
