import 'dotenv/config'

export const PORT = process.env.PORT as string
export const ENVIRONMENT = process.env.NODE_ENV as string
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
export const MONGO_URI = process.env.MONGO_URI as string
export const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME as string
export const REDIS_PORT = process.env.REDIS_PORT as string
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string
export const REDIS_USERNAME = process.env.REDIS_USERNAME as string
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string
export const DOMAIN_NAME = process.env.DOMAIN_NAME as string
export const STRIPE_KEY = process.env.STRIPE_KEY as string
export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL as string
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string
export const APP_SECRET = process.env.APP_SECRET as string
