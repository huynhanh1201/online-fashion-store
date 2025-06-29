import React from 'react'
import AccountStatistics from './AccountStatistic'

const statistics = {
  summary: {
    totalUsers: 120,
    totalAdmins: 15,
    totalCustomers: 105
  },
  byRole: [
    {
      role: 'admin',
      label: 'Quản trị viên',
      count: 15
    },
    {
      role: 'customer',
      label: 'Khách hàng',
      count: 105
    }
  ],
  chartData: {
    labels: ['Quản trị viên', 'Khách hàng'],
    datasets: [
      {
        label: 'Số lượng tài khoản theo vai trò',
        data: [15, 105],
        backgroundColor: ['#3498db', '#2ecc71']
      }
    ]
  },
  updatedAt: '2025-06-28T19:00:00+07:00'
}

function AccountDashboard() {
  return <AccountStatistics statistics={statistics} />
}

export default AccountDashboard
