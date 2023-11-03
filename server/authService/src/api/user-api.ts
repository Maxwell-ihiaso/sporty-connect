import {
  type NextFunction,
  type Request,
  type Response,
  type Express
} from 'express'
import createHttpError from 'http-errors'

import { type CustomRequest, verifyAccessToken } from './middlewares'
import { AuthService } from '@/services'

export const AuthAPI = (app: Express): void => {
  const service = new AuthService()

  app.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, phoneNumber, userName } =
      req.body

    service
      .SignUp({ email, password, firstName, lastName, phoneNumber, userName })
      .then((data) => {
        if (data) return res.status(200).json(data)
        else throw createHttpError.Conflict('User is already registered')
      })
      .catch((error) => {
        next(error)
      })
  })

  app.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { emailOrPhone, password } = req.body
    service
      .SignIn({ emailOrPhone, password })
      .then((data) => {
        if (data) {
          const { refreshToken, ...otherData } = data
          res.cookie(`${otherData.id}`, refreshToken)
          return res.status(200).json(otherData)
        } else
          throw createHttpError.BadRequest(
            'Invalid email/phone number or password'
          )
      })
      .catch((error) => {
        next(error)
      })
  })

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
