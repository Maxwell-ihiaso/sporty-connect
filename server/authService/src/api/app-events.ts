import { NextFunction, Request, Response, Express } from 'express'
import createHttpError from 'http-errors'

import { CustomerService } from '@/services'

/**
 * Initializes the app events endpoint.
 *
 * @param {Express} app - The Express application.
 */
export const appEvents = (app: Express): void => {
  const service: CustomerService = new CustomerService()

  app.post(
    '/app-events',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload = req.body

        if (payload?.data) {
          //handle subscribe events
          service.SubscribeEvents(payload)

          console.log('\n===== User Event Received =====')
          res.json(payload)
        } else throw createHttpError.BadRequest('Invalid payload')
      } catch (error) {
        next(error)
      }
    }
  )
}
