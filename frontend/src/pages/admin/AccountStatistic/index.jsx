import React, { useEffect } from 'react'
import AccountStatistics from './AccountStatistic'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
import useRoles from '~/hooks/admin/useRoles.js'
import { RouteGuard } from '~/components/PermissionGuard'

function AccountDashboard() {
  const { accountStatistics, fetchAccountStatistics } = useInventoryStatistics()
  const { roles, fetchRoles } = useRoles()

  useEffect(() => {
    fetchAccountStatistics()
    fetchRoles()
  }, [])

  // Tạo map từ role.name => role.label
  const roleLabelMap = roles.reduce((acc, role) => {
    acc[role.name] = role.label
    return acc
  }, {})

  const stats = accountStatistics || []

  const statistics = {
    summary: {
      totalUsers: stats.reduce((acc, stat) => acc + stat.count, 0),
      totalAdmins: stats
        .filter((stat) => stat.role !== 'customer')
        .reduce((acc, stat) => acc + stat.count, 0),
      totalCustomers: stats.find((stat) => stat.role === 'customer')?.count || 0
    },
    chartData: {
      labels: stats.map(
        (stat) => roleLabelMap[stat.role] || stat.role // hiển thị label nếu có
      ),
      datasets: [
        {
          label: 'Số lượng tài khoản theo vai trò',
          data: stats.map((stat) => stat.count),
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#e74c3c',
            '#f1c40f',
            '#9b59b6'
          ]
        }
      ]
    }
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'userStatistics:use']}>
      <AccountStatistics statistics={statistics} />
    </RouteGuard>
  )
}

export default AccountDashboard
