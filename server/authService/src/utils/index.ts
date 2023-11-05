import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { ErrorHandler } from './error-handler'
import axios from 'axios'

import {
  ACCESS_TOKEN_SECRET,
  EMAIL_BASE_URL,
  REFRESH_TOKEN_SECRET
} from '../config'
import { Store } from '../database'

// Utility functions

export default ErrorHandler

export const GenerateSalt = async (hash: number): Promise<string> => {
  return await bcrypt.genSalt(hash)
}

export const GeneratePassword = async (
  password: string,
  salt: any
): Promise<string> => {
  return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, savedPassword)
}

/**
 * Generates a JWT access token for a given user ID and roles array
 * @param userId - The ID of the user for whom the token is being generated
 * @param roles - An array of numbers representing the user's roles
 * @returns A Promise that resolves to an access token string
 */
export const signAccessToken = async (userId: string): Promise<string> => {
  return await new Promise((resolve, reject) => {
    // Create the payload
    const payload = {
      id: userId
    }

    // Set the options
    const options = {
      expiresIn: '30m'
    }

    // Sign the token with the payload, secret, and options
    jwt.sign(payload, ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err != null) {
        // If there is an error, reject with an internal server error
        reject(createError.InternalServerError('Unable to grant secure access'))
        return
      }
      // Otherwise, resolve with the token string
      resolve(token as string)
    })
  })
}

/**
 * Generates a signed refresh token for a user and stores it in a key-value store.
 * @param userId - The ID of the user for whom the token is being generated.
 * @param roles - The roles of the user.
 * @returns The result of storing the generated token.
 */
export const signRefreshToken = async (userId: string): Promise<string> => {
  // return a promise that generates a signed refresh token and stores it in the key-value store
  return await new Promise((resolve, reject) => {
    // create a new instance of Store
    const store = new Store()
    // define the payload and options for the token
    const payload = { id: userId }
    const options = { expiresIn: '1y' }

    // generate the token using the payload, options, and secret
    jwt.sign(payload, REFRESH_TOKEN_SECRET, options, (err, refToken) => {
      if (err) {
        // if there was an error generating the token, reject with an internal server error
        reject(
          createError.InternalServerError(
            'Unable to eastablish a secure connection'
          )
        )
        return
      }

      if (refToken) {
        // store the token in the key-value store
        void store.setStore(`${userId}`, refToken, (err) => {
          if (err != null) {
            // if there was an error storing the token, reject with an internal server error
            reject(
              createError.InternalServerError(
                'Ops! something went wrong. Please try again'
              )
            )
            return
          }
          // if the token was stored successfully, resolve with the result
          resolve(refToken as string)
        })
      }
    })
  })
}

/**
 * Revoke the refresh token for a user.
 *
 * @param userId The ID of the user.
 * @returns A Promise that resolves when the refresh token is revoked.
 */
export const revokeRefreshToken = async (userId: string): Promise<void> => {
  const store: Store = new Store()

  await store.setStore(`${userId}`, '', (err: Error | null) => {
    if (err != null) {
      console.warn(err.message)
    }
  })
}

/**
 * Checks if a user is logged in.
 *
 * @param id The user ID.
 * @returns A promise that resolves to a boolean indicating if the user is logged in.
 */
export const isLoggedIn = async (id: string): Promise<boolean> => {
  const store: Store = new Store()

  try {
    const result = await store.getStore(id)
    return result === id
  } catch (err: any) {
    console.log(err?.message)
    return false
  }
}

/**
 * Publishes a customer event.
 * @param payload The payload of the event.
 * @returns A Promise that resolves when the event is published.
 */
export async function publishEmailEvent(payload: {
  event: string
  userData: {
    otp?: number
    emailType: string
    from?: string
    to: string
    firstName: string
  }
}): Promise<void> {
  await axios.post(`${EMAIL_BASE_URL}/webhook`, payload)

  // await axios({
  //   url: `${EMAIL_BASE_URL}/webhook`,
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json;charset=UTF-8'
  //   },
  //   data: payload
  // })
}
