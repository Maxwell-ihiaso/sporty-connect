import mongoose from 'mongoose'
import { MONGO_URI } from '../config'
import { ErrorLogger } from '../utils/error-handler'

const errorLogger = new ErrorLogger()

const dbConn = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() =>
      console.log('\nDB ======== ESTABLISHED CONECTION TO DATABASE!========')
    )
    .catch((err) => errorLogger.logError(err))

  mongoose.connection.on('disconnected', () =>
    console.log('\nDB ======== Conection closed!')
  )

  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
}

export default dbConn
