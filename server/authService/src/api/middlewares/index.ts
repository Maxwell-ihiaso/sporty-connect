import { type NextFunction, type Request, type Response } from 'express'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config'
import { Store } from '../../database'

export interface CustomRequest extends Request {
  user?: any
}

/**
 * Verifies the access token in the request header.
 * If the token is valid, adds the payload to the request object and passes to the next middleware.
 * If the token is invalid, throws an unauthorized error.
 *
 * @param req - Express request object.
 * @param _res - Express response object.
 * @param next - Express next function.
 */
export const verifyAccessToken = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Check if the header has an authorization key.
    if (req.headers.authorization) {
      // Extract token from bearer token format.
      const bearerToken = req.headers.authorization.split(' ')
      const token = bearerToken?.[1]

      if (!token) throw createHttpError.Unauthorized()

      // Verify token with JWT library.
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          // If token is invalid, throw unauthorized error with specific message.
          err.name === 'JsonWebTokenError'
            ? next(
                createHttpError.Unauthorized(
                  'Wrong credentials provided. Please log in.'
                )
              )
            : next(createHttpError.Unauthorized('You are logged out.'))
          return
        }

        // If token is valid, add payload to request object and pass to next middleware.
        req.user = payload
        next()
      })
    } else {
      next(createHttpError.Unauthorized())
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Verifies a refresh token.
 * @param refreshToken - The refresh token to verify.
 * @returns A Promise that resolves with the user ID if the token is valid, or rejects with an error if not.
 */
export const verifyRefreshToken = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): void => {
  // Instantiate a new Store instance
  const store = new Store()

  // Get refreshToken from httpOnly cookie
  const refreshToken = req.cookies?.userId

  // Verify the refresh token and extract the user ID from the payload
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, payload: any) => {
    if (err) {
      // If token is invalid, throw unauthorized error with specific message.
      err.name === 'JsonWebTokenError'
        ? next(
            createHttpError.Unauthorized(
              'Wrong credentials provided. Please log in.'
            )
          )
        : next(createHttpError.Unauthorized('You are logged out.'))
    }

    const userId = payload?.id

    // Retrieve the stored refresh token for the user ID
    void store.getStore(userId, (err, reply) => {
      // If there is an error retrieving the stored token, reject with an InternalServerError error
      if (err) {
        next(createHttpError.InternalServerError())
      }

      // If the stored token matches the provided token, resolve with the user ID
      if (refreshToken === reply) {
        req.user = payload
        next()
      }

      // If the stored token does not match the provided token, reject with an Unauthorized error
      next(createHttpError.Unauthorized())
    })
  })
}
