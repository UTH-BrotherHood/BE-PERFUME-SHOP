import express from 'express'
import cors from 'cors'
import databaseServices from '~/services/database.services'
import usersRouters from '~/routes/users.routes'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import categoriesRouter from './routes/categories.routes'
import productsRouters from './routes/products.routes'
import wishlistRouters from './routes/wishlist.routes'
import cartsRouters from './routes/carts.routes'
import ordersRouters from './routes/orders.routes'
import paymentRouters from './routes/payments.routes'
import shippingAddressRouters from './routes/shippingAddress.routes'
import { envConfig } from './constants/config'
import searchRouters from './routes/search.routes'
import dashboardRouters from './routes/dashboard.routes'

// const databaseServices
databaseServices.connect()

const app = express()
app.use(cors())
const port = envConfig.port
// Middlewares for parsing body
app.use(express.json())
// Routes for users
app.use('/users', usersRouters)
// Routes for categories
app.use('/categories', categoriesRouter)
// Routes for products
app.use('/products', productsRouters)
// Routes for wishlist
app.use('/wishlist', wishlistRouters)
// Routes for cart
app.use('/cart', cartsRouters)
// Routes for payment
app.use('/payment', paymentRouters)
// Routes for orders
app.use('/orders', ordersRouters)
// Routes for shippingAddress
app.use('/shipping-address', shippingAddressRouters)
// Routes for search
app.use('/search', searchRouters)
// Routes for dashboard
app.use('/dashboard', dashboardRouters)
// Error handler
app.use(defaultErrorHandler)
// Health check
app.use('/health', (req, res) => {
  res.send(`dope shit man, i'm still alive`)
})
app.listen(port, () => {
  console.log(`Server is running at port :${port}`)
})
