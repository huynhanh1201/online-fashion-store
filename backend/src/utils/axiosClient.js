import axios from 'axios'
import { env } from '~/config/environment'

export const ghnAxios = axios.create({
  baseURL: env.GHN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Token: env.GHN_TOKEN_API,
    ShopId: env.GHN_SHOP_ID.toString()
  }
})
