import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'
import morgan from 'morgan'
import {
  AUTH_MICROSERVICE,
  CHECKOUT_MICROSERVICE,
  ENVIRONMENT,
  ORDER_MICROSERVICE,
  PRODUCT_MICROSERVICE,
  USER_MICROSERVICE
} from './config'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', proxy(USER_MICROSERVICE))
// app.use('/cart', proxy(CART_MICROSERVICE))
app.use('/order', proxy(ORDER_MICROSERVICE))
app.use('/checkout', proxy(CHECKOUT_MICROSERVICE))
app.use('/auth', proxy(AUTH_MICROSERVICE))
app.use('/', proxy(PRODUCT_MICROSERVICE)) // products

app.listen(8000, () => {
  console.log(`${ENVIRONMENT} environment started`)
  console.log('Gateway is Listening to Port 8000')
})
