import express, { type Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import { appEvents } from './api'
import { EmailAPI } from './api/email-api'
import { ErrorHandler } from './utils/error-handler'

export default async (app: Express): Promise<void> => {
  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())

  // api
  appEvents(app)
  EmailAPI(app)

  // error handling
  app.use(ErrorHandler)
}
