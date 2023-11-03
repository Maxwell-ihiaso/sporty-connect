import { type NextFunction, type Request, type Response } from 'express'
import { createLogger, transports, format } from 'winston'
// require("winston-mongodb")

interface CustomError extends Error {
  status?: any
}

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../logs/customer_app_error.log' })
    //  new transports.MongoDB({
    //     level: 'error',
    //     //mongo database connection link
    //     db : 'mongodb://localhost:27017/logs',
    //     options: {
    //         useUnifiedTopology: true
    //     },
    //     // A collection to save json formatted logs
    //     collection: 'server_logs',
    //     format: format.combine(
    //     format.timestamp(),
    //     // Convert logs to a json format
    //     format.json())
    // })
  ],
  format: format.combine(
    format.label({
      label: `😔🥱🤧😪`
    }),
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.align(),
    format.printf(
      (error) =>
        `${error.level}: ${error.label}: ${[error.timestamp]}: ${error.message}`
    )
  )
})

export class ErrorLogger {
  async logError(
    err: CustomError,
    req?: Request,
    res?: Response
  ): Promise<void> {
    console.log('\n============= Start Error Logger ======\n')
    LogErrors.error(
      `${err.status || 500} - ${res?.statusMessage} - ${err.message} - ${
        req?.originalUrl
      } - ${req?.method} - ${req?.ip}`
    )
    console.log('\n========= End Error Logger ======\n')
  }
}

export const ErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
  const errorLogger = new ErrorLogger()
  err?.statusCode >= 500 && (await errorLogger.logError(err, req, res))

  const status = err?.statusCode ?? 500

  return res.status(status).json({
    message: `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  })
}
