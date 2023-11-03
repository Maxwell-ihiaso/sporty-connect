import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'
import morgan from 'morgan'
import {
  AUTH_MICROSERVICE,
  ENVIRONMENT,
  PRODUCT_MICROSERVICE,
  USER_MICROSERVICE
} from './config'

const app = express()

if (ENVIRONMENT === 'development') {
  app.use(morgan('dev'))
}
app.use(cors())

app.use('/user', proxy(USER_MICROSERVICE))
app.use('/auth', proxy(AUTH_MICROSERVICE))
app.use('/', proxy(PRODUCT_MICROSERVICE)) // products

app.listen(8000, () => {
  console.log(`${ENVIRONMENT} environment started`)
  console.log('Gateway is Listening to Port 8000')
})
