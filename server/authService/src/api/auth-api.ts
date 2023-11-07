import {
  type NextFunction,
  type Request,
  type Response,
  type Express
} from 'express'
import createHttpError from 'http-errors'

import {
  type CustomRequest,
  verifyAccessToken,
  verifyPasswordResetToken
} from './middlewares'
import { AuthService } from '@/services'

export enum EMAIL_TYPE {
  SEND_EMAIL_OTP = 'SEND_EMAIL_OTP',
  SEND_WELCOME_EMAIL = 'SEND_WELCOME_EMAIL',
  SEND_PASSWORD_RESET_LINK = 'SEND_PASSWORD_RESET_LINK',
  SEND_PASSWORD_UPDATE_SUCCESS = 'SEND_PASSWORD_UPDATE_SUCCESS'
}

export const AuthAPI = (app: Express): void => {
  const service = new AuthService()

  app.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, phoneNumber, userName } =
      req.body

    try {
      if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !userName
      ) {
        throw createHttpError.BadRequest(
          'email, password, firstName, lastName, phoneNumber, userName is required'
        )
      }

      service
        .SignUp({ email, password, firstName, lastName, phoneNumber, userName })
        .then((data) => {
          if (data) {
            return res.status(data.status).json(data)
          } else
            throw createHttpError.InternalServerError(
              'Ops! something happend while creating a new user'
            )
        })
        .catch((error) => {
          next(error)
        })
    } catch (error) {
      next(error)
    }
  })

  app.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { emailOrPhone, password } = req.body

    try {
      if (!emailOrPhone || !password)
        throw createHttpError.BadRequest('email/phone and password is required')

      service
        .SignIn({ emailOrPhone, password })
        .then((data) => {
          if (data && data.data) {
            const { refreshToken, ...otherData } = data.data
            data.status === 200 && res.cookie(`${otherData.id}`, refreshToken)

            return res.status(data.status).json(data)
          } else return res.status(data.status).json(data)
        })
        .catch((error) => {
          next(error)
        })
    } catch (error) {
      next(error)
    }
  })

  app.post(
    '/validateEmail',
    (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body
      try {
        if (!email) throw createHttpError.BadRequest('email is required')
        service
          .ValidateEmail(email)
          .then((data) => {
            if (data) {
              return res.status(data.status).json(data)
            } else throw createHttpError[500]('Ops something happened')
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )

  app.post(
    '/verifyEmailOTP',
    (req: Request, res: Response, next: NextFunction) => {
      const { userId, otp } = req.body
      try {
        if (!userId || !otp)
          throw createHttpError.BadRequest('userId, and otp is required')
        service
          .VerifyEmailOTP(userId, otp)
          .then((data) => {
            if (data) {
              return res.status(data?.status).json(data)
            } else throw createHttpError[500]('unable to verify email')
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )

  app.post(
    '/validatePhone',
    (req: Request, res: Response, next: NextFunction) => {
      const { phoneNumber } = req.body

      try {
        if (!phoneNumber)
          throw createHttpError.BadRequest('phoneNumber is required')
        service
          .ValidatePhone(phoneNumber)
          .then((data) => {
            console.log('DATA FROM PHONE', data)

            return res.status(200).json(data)
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )

  app.post(
    '/verifyPhoneOTP',
    (req: Request, res: Response, next: NextFunction) => {
      const { userId, otp } = req.body
      try {
        if (!userId || !otp)
          throw createHttpError.BadRequest('userId, and otp is required')
        service
          .VerifyPhoneOTP(userId, otp)
          .then((data) => {
            if (data) {
              return res.status(data?.status).json(data)
            } else throw createHttpError[500]('unable to verify phone number')
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )

  // TODO: create a logout service. it sould also delete the refresh token from the store using revokeRefreshToken
  app.post(
    '/logout',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .SignOut(id)
        .then(() => {
          res.clearCookie(`${id}`)
          return res.status(204).end()
        })
        .catch((error) => {
          next(error)
        })
    }
  )
  app.post(
    '/reset-password',
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { email } = req.body
      try {
        if (!email) throw createHttpError.BadRequest('email is required')

        service
          .sendPasswordResetLink(email)
          .then((data) => {
            return res.status(data?.status).json(data)
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )
  app.patch(
    '/update-password',
    verifyPasswordResetToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user
      const { newPassword } = req.body

      try {
        if (!id)
          throw createHttpError[403](
            'Invalid credentials. Use password reset link sent to your email'
          )
        if (!newPassword)
          throw createHttpError.BadRequest('newPassword is required')

        service
          .updatePassword(id, newPassword)
          .then((data) => {
            return res.status(data.status).json(data)
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )
  app.patch(
    '/update-email',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user
      const { email } = req.body

      try {
        if (!id) throw createHttpError[403]('Invalid credentials.')
        if (!email) throw createHttpError.BadRequest('email is required')

        service
          .updateEmail(id, email)
          .then((data) => {
            return res.status(data.status).json(data)
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )
  app.patch(
    '/update-username',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user
      const { userName } = req.body

      try {
        if (!id) throw createHttpError[403]('Invalid credentials.')
        if (!userName) throw createHttpError.BadRequest('userName is required')

        service
          .updateUsername(id, userName)
          .then((data) => {
            return res.status(data.status).json(data)
          })
          .catch((error) => {
            next(error)
          })
      } catch (error) {
        next(error)
      }
    }
  )

  app.get('/whoami', (_req: Request, res: Response) => {
    return res.status(200).json({ msg: '/user : I am User Service' })
  })

  app.all('*', (req: CustomRequest, _res: Response, next: NextFunction) => {
    next(
      createHttpError.NotFound(
        `No resource for ${req.method} to ${req.originalUrl}`
      )
    )
  })
}
