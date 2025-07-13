import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'

import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [serchParams] = useSearchParams()

  // const email = serchParams.get('email')
  // const token = serchParams.get('token')

  const { email, token } = Object.fromEntries([...serchParams])

  // Taọ một biến state để biết được là đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // Nếu URL có vấn đề không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) return <Navigate to='/404' />

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption='Đang xác thực tài khoản của bạn...' />
  }

  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
