import crypto from 'crypto'
import { stringify } from 'querystring'

import sortObject from './sortObject'
import { env } from '~/config/environment'
import dayjs from 'dayjs'

const generatePaymentUrl = () => {
  return 'generatePaymentUrl'
}

const verifyChecksum = (vnp_Params) => {
  const secureHash = vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)
  const signData = stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', env.VNP_HASHSECRET)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  return secureHash === signed
}

export { generatePaymentUrl, verifyChecksum }
