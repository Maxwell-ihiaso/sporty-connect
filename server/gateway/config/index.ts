import 'dotenv/config';

export const AUTH_MICROSERVICE = process.env.AUTH_MICROSERVICE as string;
export const USER_MICROSERVICE = process.env.USER_MICROSERVICE as string;
export const PRODUCT_MICROSERVICE = process.env.PRODUCT_MICROSERVICE as string;
export const CART_MICROSERVICE = process.env.CART_MICROSERVICE as string;
export const CHECKOUT_MICROSERVICE = process.env
  .CHECKOUT_MICROSERVICE as string;
export const ORDER_MICROSERVICE = process.env.ORDER_MICROSERVICE as string;

export const ENVIRONMENT = process.env.NODE_ENV as string;
