import React, { useEffect } from 'react'
import AccountStatistics from './AccountStatistic'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'

function AccountDashboard() {
  const { accountStatistics, fetchAccountStatistics } = useInventoryStatistics()

  useEffect(() => {
    fetchAccountStatistics()
  }, [])

  const statistics = {
    summary: {
      totalUsers: accountStatistics.reduce((acc, stat) => acc + stat.count, 0),
      totalAdmins:
        accountStatistics.find((stat) => stat.role === 'admin')?.count || 0,
      totalCustomers:
        accountStatistics.find((stat) => stat.role === 'customer')?.count || 0
    },
    chartData: {
      labels: accountStatistics.map((stat) => stat.role),
      datasets: [
        {
          label: 'Số lượng tài khoản theo vai trò',
          data: accountStatistics.map((stat) => stat.count),
          backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'] // Add more colors if needed
        }
      ]
    }
  }

  return <AccountStatistics statistics={statistics} />
}

export default AccountDashboard
