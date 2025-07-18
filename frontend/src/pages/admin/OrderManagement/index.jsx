import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import OrderTable from './OrderTable'
import OrderPagination from './OrderPagination'
import ViewOrderModal from './modal/ViewOrderModal'
import EditOrderModal from './modal/EditOrderModal' // import Chart sửa
import DeleteOrderModal from './modal/DeleteOrderModal' // import Chart xoá
import useOrder from '~/hooks/admin/useOrder'
import useDiscounts from '~/hooks/admin/useDiscount'
import useUsers from '~/hooks/admin/useUsers.js'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard } from '~/components/PermissionGuard'
import useRoles from '~/hooks/admin/useRoles.js'
const OrderManagement = () => {
  const { hasPermission } = usePermissions()
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({ sort: 'newest' }) // nếu cần lọc thì thêm filters
  const [openViewModal, setOpenViewModal] = React.useState(false)
  const [openEditModal, setOpenEditModal] = React.useState(false) // Chart sửa
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false) // Chart xoá
  const [selectedOrder, setSelectedOrder] = React.useState(null)
  const [histories, setHistories] = React.useState([])
  const [orderDetails, setOrderDetails] = React.useState([])
  const [loadingEdit, setLoadingEdit] = React.useState(false)
  const [loadingDelete, setLoadingDelete] = React.useState(false)
  const {
    orders,
    totalPages,
    loading,
    fetchOrders,
    getOrderHistoriesByOrderId,
    getOrderDetailsByOrderId,
    updateOrderById,
    getOrderId,
    Save,
    remove
  } = useOrder()

  const { discounts, fetchDiscounts } = useDiscounts() // lấy danh sách mã giảm giá nếu cần
  const { users, fetchUsers } = useUsers()
  const { roles, fetchRoles } = useRoles()
  useEffect(() => {
    fetchUsers().catch((error) => console.error('Error fetching users:', error))
    fetchDiscounts().catch((error) =>
      console.error('Error fetching discounts:', error)
    )
    fetchRoles()
  }, [])

  useEffect(() => {
    fetchOrders(page, limit, filters).catch((error) =>
      console.error('Error fetching orders:', error)
    )
  }, [page, limit, filters])

  // Kiểm tra quyền truy cập order management
  // if (!hasPermission('order:read')) {
  //   return (
  //     <Box sx={{ p: 3, textAlign: 'center' }}>
  //       <Typography variant='h6' color='error'>
  //         Bạn không có quyền truy cập quản lý đơn hàng
  //       </Typography>
  //     </Box>
  //   )
  // }

  // Mở Chart xem
  const handleOpenModalView = async (order) => {
    if (!hasPermission('order:read')) return
    setSelectedOrder(order)
    const [historiesData, detailsData] = await Promise.all([
      getOrderHistoriesByOrderId(order._id),
      getOrderDetailsByOrderId(order._id)
    ])
    setHistories(historiesData)
    setOrderDetails(detailsData)
    setOpenViewModal(true)
  }

  const handleCloseModalView = () => {
    setOpenViewModal(false)
    setSelectedOrder(null)
    setHistories([])
    setOrderDetails([])
  }

  // Mở Chart sửa
  const handleOpenModalEdit = async (order) => {
    if (!hasPermission('order:update')) return
    setLoadingEdit(true)
    setSelectedOrder(order)
    // Nếu cần fetch thêm data thì await ở đây
    setOpenEditModal(true)
    setLoadingEdit(false)
  }

  const handleCloseModalEdit = () => {
    setOpenEditModal(false)
    setSelectedOrder(null)
    setLoadingEdit(false)
  }

  // Mở Chart xoá
  const handleOpenModalDelete = (order) => {
    if (!hasPermission('order:delete')) return
    setSelectedOrder(order)
    setOpenDeleteModal(true)
    setLoadingDelete(false) // chưa xoá
  }

  const handleCloseModalDelete = () => {
    setOpenDeleteModal(false)
    setSelectedOrder(null)
    setLoadingDelete(false)
  }

  // Xử lý update đơn hàng
  const handleUpdateOrder = async (orderId, data) => {
    try {
      await updateOrderById(orderId, data)
      handleCloseModalEdit()
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error)
    }
  }
  // In OrderManagement component
  const handleChangStatusOrder = async (orderId, data) => {
    try {
      const updatedOrder = await updateOrderById(orderId, data)
      if (updatedOrder) {
        // Update the selectedOrder with the new status
        setSelectedOrder(updatedOrder)

        // Fetch updated histories
        const updatedHistories = await getOrderHistoriesByOrderId(orderId)
        setHistories(updatedHistories)
      }
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error)
    }
  }

  // Xử lý xoá đơn hàng
  const handleDeleteOrder = async () => {
    try {
      if (!selectedOrder) return
      await remove(selectedOrder._id)
      handleCloseModalDelete() // Đóng Chart xoá
    } catch (error) {
      console.error('Lỗi xoá đơn hàng:', error)
    }
  }
  const handleChangePage = (event, value) => {
    setPage(value)
  }
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
    }
  }
  return (
    <RouteGuard requiredPermissions={['admin:access', 'order:use']}>
      <OrderTable
        orders={orders}
        loading={loading}
        onView={handleOpenModalView}
        onEdit={handleOpenModalEdit} // truyền sự kiện mở Chart sửa
        onDelete={handleOpenModalDelete} // truyền sự kiện mở Chart xoá
        onFilter={handleFilter}
        fetchOrders={fetchOrders}
        coupons={discounts} // truyền danh sách mã giảm giá nếu cần
        users={users} // truyền danh sách người dùng nếu cần
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      {/*<OrderPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={(e, val) => setPage(val)}*/}
      {/*/>*/}

      <ViewOrderModal
        open={openViewModal}
        onClose={handleCloseModalView}
        order={selectedOrder}
        histories={histories}
        orderDetails={orderDetails}
        onUpdate={handleChangStatusOrder}
        roles={roles}
      />

      <EditOrderModal
        open={openEditModal}
        onClose={handleCloseModalEdit}
        order={selectedOrder}
        onUpdate={handleUpdateOrder}
        loading={loadingEdit}
      />

      <DeleteOrderModal
        open={openDeleteModal}
        onClose={handleCloseModalDelete}
        order={selectedOrder}
        onConfirm={handleDeleteOrder}
        loading={loadingDelete}
      />
    </RouteGuard>
  )
}

export default OrderManagement
