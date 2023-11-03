/* eslint-disable @typescript-eslint/restrict-template-expressions */
import express, { type Express } from 'express'

import { ENVIRONMENT, PORT } from './config'
import expressApp from './express-app'
import { dbConn } from './database'
import { ErrorLogger } from './utils/error-handler'
// import { CreateChannel } from './utils'

const StartServer = async (): Promise<void> => {
  const app: Express = express()
  const logger = new ErrorLogger()

  await dbConn()

  //   const channel = await CreateChannel()

  await expressApp(app, 'channel')

  app
    .listen(PORT, () => {
      console.log(`${ENVIRONMENT} environment started`)
      console.log(`Custoemr service is listening to port ${PORT}`)
    })
    .on('error', async (err) => {
      await logger.logError(err)
      process.exit()
    })
    .on('close', () => {
      console.log('Server stopped')
      // channel.close()
    })
}

void StartServer()
