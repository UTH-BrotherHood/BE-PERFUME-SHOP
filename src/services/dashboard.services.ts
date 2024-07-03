import { ErrorWithStatus } from '~/models/errors'
import databaseServices from './database.services'
import { v4 as uuidv4 } from 'uuid'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDERS_MESSAGES } from '~/constants/messages'

class DashboardService {
  async getCategory() {
    const query_total = `
        SELECT 
            (SELECT SUM(o.total_price) FROM orders o) AS total_revenue,
            (SELECT SUM(oi.quantity) FROM order_item oi INNER JOIN orders o ON oi.order_id = o.id) AS total_products_sold,
            (SELECT COUNT(*) FROM orders) AS total_orders
    `
    const total = await databaseServices.query(query_total)

    const query_latest_orders = `
        SELECT 
            o.id AS order_id,
            o.order_date,
            o.total_price,
            p.name AS product_name,
            p.images[1] AS product_image,
            oi.quantity,
            u.username AS customer_name
        FROM 
            orders o
        INNER JOIN 
            order_item oi ON o.id = oi.order_id
        INNER JOIN 
            products p ON oi.product_id = p.id
        INNER JOIN 
            users u ON o.user_id = u.id
        ORDER BY 
            o.order_date DESC
        LIMIT 10;
    `
    const latest_orders = await databaseServices.query(query_latest_orders)

    const query_most_sold_items_by_category = `
        SELECT 
            c.name AS category_name,
            SUM(oi.quantity) AS total_quantity_sold
        FROM 
            order_item oi
        INNER JOIN 
            products p ON oi.product_id = p.id
        INNER JOIN 
            category c ON p.category_id = c.id
        GROUP BY 
            c.name
        ORDER BY 
            total_quantity_sold DESC
        LIMIT 4;
    `
    const most_sold_items_by_category = await databaseServices.query(query_most_sold_items_by_category)

    const query_daily_sales = `
                WITH days AS (
            SELECT 
                generate_series(
                    date_trunc('month', CURRENT_DATE), 
                    date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day', 
                    interval '1 day'
                )::date AS day
        ),
        sales AS (
            SELECT 
                o.order_date::date AS day,
                SUM(o.total_price) AS total_revenue
            FROM 
                orders o
            GROUP BY 
                o.order_date::date
        )
        SELECT 
            d.day,
            COALESCE(s.total_revenue, 0) AS total_revenue
        FROM 
            days d
        LEFT JOIN 
            sales s ON d.day = s.day
        ORDER BY 
            d.day;

    `
    const daily_sales = await databaseServices.query(query_daily_sales)

    return {
      total: total.rows[0],
      latest_orders: latest_orders.rows,
      most_sold_items_by_category: most_sold_items_by_category.rows,
      daily_sales: daily_sales.rows
    }
  }
}

const dashboardService = new DashboardService()
export default dashboardService
