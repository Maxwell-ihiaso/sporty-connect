import { createClient } from 'redis'
import { REDIS_HOSTNAME, REDIS_PASSWORD, REDIS_PORT } from '../config'
import { ErrorLogger } from '@/utils/error-handler'
// import createError from 'http-errors';

const host = REDIS_HOSTNAME
const port = Number(REDIS_PORT)
const password = REDIS_PASSWORD
const errorLogger = new ErrorLogger()

const client = createClient({
  password: password,
  socket: {
    host,
    port
  }
})

const startConnection = async () => {
  await client.connect()
}

client.on('connect', () => console.log('\nConnecting to redis cache...'))

client.on('ready', () => console.log('\nconnected to redis cache!'))

client.on('error', (err: Error) => {
  console.log('\nRedis error', err)
  errorLogger.logError(err)
})

client.on('end', () => console.log('\nredis instance closed successfully!'))

process.on('SIGINT', () => client.quit())

/**=======================
 * STORE CLASS
 * =======================
 */
class Store {
  constructor() {
    if (!client.isOpen) startConnection()
  }

  async setStore(
    userId: string,
    refToken: string,
    callback?: (err: Error | null, result: string | null) => void
  ) {
    const key = `${userId}`
    const value = refToken

    await client
      .set(key, value)
      .then((result) => callback && callback(null, result))
      .catch((err) => callback && callback(err, null))
  }

  async getStore(
    key: string,
    callback?: (err: Error | null, result: string | null) => void
  ) {
    return await client
      .get(key)
      .then((result) => {
        callback && callback(null, result)
        return result
      })
      .catch((err) => callback && callback(err, null))
  }
}

export default Store
