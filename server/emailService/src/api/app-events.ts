import { NextFunction, Request, Response, Express } from 'express'
import createHttpError from 'http-errors'

import EmailService, { EmailDataProps } from '@/services/email-services'

/**
 * Initializes the app events endpoint.
 *
 * @param {Express} app - The Express application.
 */
export const appEvents = (app: Express): void => {
  const service = new EmailService()

  app.post(
    '/webhook',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload: {
          event: string
          userData: EmailDataProps & { otp: number }
        } = req.body

        if (payload?.userData) {
          //handle subscribe events
          service.SubscribeEvents({ ...payload, res })

          console.log('\n===== User Event Received =====')
          res.status(204).json(payload)
        } else throw createHttpError.BadRequest('Invalid payload')
      } catch (error) {
        next(error)
      }
    }
  )
}
