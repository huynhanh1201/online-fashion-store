import { env } from '~/config/environment'

// Những domain nào được phép gọi API từ backend
export const WHITELIST_DOMAINS = [
  'http://localhost:8017',
  'http://localhost:5174',
  'http://localhost:5173'
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
