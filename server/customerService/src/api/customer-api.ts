import {
  type NextFunction,
  type Request,
  type Response,
  type Express
} from 'express'
import createHttpError from 'http-errors'

import { CustomerService } from '../services'
import {
  type CustomRequest,
  verifyAccessToken,
  verifyRoles
} from './middlewares'
// import { SubscribeMessage } from '@/utils';

export const customerAPI = (app: Express, channel: string): void => {
  const service = new CustomerService()

  console.log('Channel from API', channel)

  // To listen
  //   SubscribeMessage(channel, service);

  app.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    const { email, password, phone } = req.body
    service
      .SignUp({ email, password, phone })
      .then((data) => {
        if (data != null) return res.status(200).json(data)
        else throw createHttpError.Conflict('User is already registered')
      })
      .catch((error) => {
        next(error)
      })
  })

  app.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    service
      .SignIn({ email, password })
      .then((data) => {
        if (data != null) {
          const { refreshToken, ...otherData } = data
          res.cookie(`${otherData.id}`, refreshToken)
          return res.status(200).json(otherData)
        } else throw createHttpError.BadRequest('Invalid email or password')
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

  app.post(
    '/address/new',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user
      const { street, postalCode, city, country } = req.body

      service
        .AddNewAddress(id, { street, postalCode, city, country })
        .then((data) => {
          if (data != null) {
            return res.status(200).json(data)
          } else throw createHttpError.BadRequest('Invalid address')
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/address',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetAddress(id)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/profile',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetProfileById(id)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/profiles',
    verifyAccessToken,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    verifyRoles(1984),
    (_req: CustomRequest, res: Response, next: NextFunction) => {
      service
        .GetAllUsers()
        .then((users) => {
          res.status(200).json(users)
        })
        .catch((err) => {
          next(err)
        })
    }
  )

  app.get(
    '/shoping-details',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetShopingDetails(id)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/wishlist',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetWishList(id)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/cart',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetCart(id)
        .then((data) => {
          res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get(
    '/orders',
    verifyAccessToken,
    (req: CustomRequest, res: Response, next: NextFunction) => {
      const { id } = req.user

      service
        .GetOrders(id)
        .then((data) => {
          return res.status(200).json(data)
        })
        .catch((error) => {
          next(error)
        })
    }
  )

  app.get('/whoami', (_req: Request, res: Response) => {
    return res.status(200).json({ msg: '/customer : I am Customer Service' })
  })

  app.all('*', (req: CustomRequest, _res: Response, next: NextFunction) => {
    next(
      createHttpError.NotFound(
        `No resource for ${req.method} to ${req.originalUrl}`
      )
    )
  })
}
