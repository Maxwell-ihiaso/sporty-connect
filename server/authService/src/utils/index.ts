import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import amqplib from 'amqplib';
import createError from 'http-errors'
import { ErrorHandler } from './error-handler'

import {
  // APP_SECRET,
  // EXCHANGE_NAME,
  //   CUSTOMER_SERVICE,
  // MSG_QUEUE_URL,
  ACCESS_TOKEN_SECRET,
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
export const signAccessToken = async (
  userId: string,
  roles: number[]
): Promise<string> => {
  return await new Promise((resolve, reject) => {
    // Create the payload
    const payload = {
      id: userId,
      roles
    }

    // Set the options
    const options = {
      expiresIn: '30m'
    }

    // Sign the token with the payload, secret, and options
    jwt.sign(payload, ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err != null) {
        // If there is an error, reject with an internal server error
        reject(
          createError.InternalServerError('Unable to establish token handshake')
        )
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
export const signRefreshToken = async (
  userId: string,
  roles: number[]
): Promise<string> => {
  // return a promise that generates a signed refresh token and stores it in the key-value store
  return await new Promise((resolve, reject) => {
    // create a new instance of Store
    const store = new Store()
    // define the payload and options for the token
    const payload = { id: userId, roles }
    const options = { expiresIn: '1y' }

    // generate the token using the payload, options, and secret
    jwt.sign(payload, REFRESH_TOKEN_SECRET, options, (err, refToken) => {
      if (err != null) {
        // if there was an error generating the token, reject with an internal server error
        reject(createError.InternalServerError('wrong credentials provided'))
        return
      }

      // store the token in the key-value store
      void store.setStore(`${userId}`, refToken, (err) => {
        if (err != null) {
          // if there was an error storing the token, reject with an internal server error
          reject(createError.InternalServerError('wrong credentials provided'))
          return
        }
        // if the token was stored successfully, resolve with the result
        resolve(refToken as string)
      })
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

// //Message Broker
// export const CreateChannel = async () => {
//   try {
//     const connection = await amqplib.connect(MSG_QUEUE_URL);
//     const channel = await connection.createChannel();
//     await channel.assertQueue(EXCHANGE_NAME, 'direct', { durable: true });
//     return channel;
//   } catch (err) {
//     throw err;
//   }
// };

// export const PublishMessage = (channel, service, msg) => {
//   channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
//   console.log('Sent: ', msg);
// };

// export const SubscribeMessage = async (channel, service) => {
//   await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
//   const q = await channel.assertQueue('', { exclusive: true });
//   console.log(` Waiting for messages in queue: ${q.queue}`);

//   channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

//   channel.consume(
//     q.queue,
//     (msg) => {
//       if (msg.content) {
//         console.log('the message is:', msg.content.toString());
//         service.SubscribeEvents(msg.content.toString());
//       }
//       console.log('[X] received');
//     },
//     {
//       noAck: true,
//     },
//   );
// };
