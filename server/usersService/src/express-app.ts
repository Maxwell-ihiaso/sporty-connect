import express, { type Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import ErrorHandler from './utils'
import { appEvents, customerAPI } from './api'

// import { SubscribeMessage } from './utils'

export default async (app: Express, channel: any): Promise<void> => {
  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())

  // api

  appEvents(app)
  customerAPI(app, channel)

  // error handling
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.use(ErrorHandler)
}
