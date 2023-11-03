import { NextFunction, Request, Response, Express } from 'express'
import createHttpError from 'http-errors'

import { AuthService } from '@/services'
import { UserDataProps } from '@/services/user-service'

/**
 * Initializes the app events endpoint.
 *
 * @param {Express} app - The Express application.
 */
export const appEvents = (app: Express): void => {
  const service = new AuthService()

  app.post(
    '/webhook',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload: {event: string; userData: UserDataProps} = req.body

        if (payload?.userData) {
          //handle subscribe events
          service.SubscribeEvents(payload)

          console.log('\n===== User Event Received =====')
          res.status(204).json(payload)
        } else throw createHttpError.BadRequest('Invalid payload')
      } catch (error) {
        next(error)
      }
    }
  )
}
