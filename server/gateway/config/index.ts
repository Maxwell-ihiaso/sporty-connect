import 'dotenv/config'

export const AUTH_MICROSERVICE = process.env.AUTH_MICROSERVICE as string
export const USER_MICROSERVICE = process.env.USER_MICROSERVICE as string
export const PRODUCT_MICROSERVICE = process.env.PRODUCT_MICROSERVICE as string

export const ENVIRONMENT = process.env.NODE_ENV as string
