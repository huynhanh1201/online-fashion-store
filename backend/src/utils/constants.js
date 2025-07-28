import { env } from '~/config/environment'

// Những domain nào được phép gọi API từ backend
export const WHITELIST_DOMAINS = [
  'https://online-fashion-store-iota.vercel.app'
]

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'prod'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVLOPMENT

// Các quyền trong dự án
export const ROLE = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}
