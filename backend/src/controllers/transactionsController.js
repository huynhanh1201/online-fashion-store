import { transactionsService } from '~/services/transactionsService'

// Thanh toán VNPAY
const vnpayIPN = async (req, res, next) => {
  try {
    const result = await transactionsService.vnpayIPN(req)

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

const vnpayReturn = async (req, res, next) => {
  try {
    const result = await transactionsService.vnpayReturn(req)

    res.redirect(result)
    // res.status(200).json({ code: resultCode })
  } catch (err) {
    next(err)
  }
}

export const transactionsController = {
  vnpayIPN,
  vnpayReturn
}
