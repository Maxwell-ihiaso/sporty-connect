import { EmailService } from '@/services'
import { EMAIL_TYPE } from '@/services/email-services'
import {
  type NextFunction,
  type Request,
  type Response,
  type Express
} from 'express'
import createHttpError from 'http-errors'

export const EmailAPI = (app: Express): void => {
  const service = new EmailService()

  // app.post('/sendMail', (req: Request, res: Response, next: NextFunction) => {
  //   const { from, to, subject, message, firstName } = req.body
  //   if (to && subject && message && firstName) {
  //     service.SendMail(
  //       { from, to, emailType: EMAIL_TYPE.SEND_EMAIL_OTP, firstName },
  //       res
  //     )
  //   } else {
  //     next(createHttpError.BadRequest('emailType, to, firstName is required'))
  //   }
  // })
  app.post(
    '/sendEmailOTP',
    (req: Request, res: Response, next: NextFunction) => {
      const { from, to, emailType, firstName, otp } = req.body

      if (to && emailType && firstName && otp) {
        service.SendEmailOTP(
          { from, to, emailType: EMAIL_TYPE.SEND_EMAIL_OTP, firstName, otp },
          res
        )
      } else {
        next(
          createHttpError.BadRequest(
            'emailType, to, firstName, otp is required'
          )
        )
      }
    }
  )

  app.get('/whoami', (_req: Request, res: Response) => {
    return res.status(200).json({ msg: '/email : I am User Service' })
  })

  app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    next(
      createHttpError.NotFound(
        `No resource for ${req.method} to ${req.originalUrl}`
      )
    )
  })
}
