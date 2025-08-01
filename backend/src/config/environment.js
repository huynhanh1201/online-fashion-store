/* eslint-disable */
// import 'dotenv/config'

// Deploy
import dotenv from 'dotenv'
import path from 'path'

// Auto chọn file .env tương ứng môi trường
const envPath =
  process.env.NODE_ENV === 'production'
    ? '/etc/secrets/.env' // đường dẫn Render mount
    : path.resolve(process.cwd(), '.env') // local dev

dotenv.config({ path: envPath })

// =======================================================

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE,

  WEBSITE_DOMAIN_DEVLOPMENT: process.env.WEBSITE_DOMAIN_DEVLOPMENT,
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION,
  FE_BASE_URL: process.env.FE_BASE_URL,

  BREVO_API_KEY: process.env.BREVO_API_KEY,
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME,

  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,

  VNP_TMNCODE: process.env.VNP_TMNCODE,
  VNP_HASHSECRET: process.env.VNP_HASHSECRET,
  VNP_URL: process.env.VNP_URL,
  VNP_RETURN_URL: process.env.VNP_RETURN_URL,
  VNP_IPN_URL: process.env.VNP_IPN_URL,

  GHN_SHOP_ID: process.env.GHN_SHOP_ID,
  GHN_TOKEN_API: process.env.GHN_TOKEN_API,
  GHN_BASE_URL: process.env.GHN_BASE_URL
}
