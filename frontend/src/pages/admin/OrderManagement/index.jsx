import React from 'react'
import Typography from '@mui/material/Typography'
import OrderTable from './OrderTable'
import OrderPagination from './OrderPagination'
import ViewOrderModal from './modal/ViewOrderModal'
import EditOrderModal from './modal/EditOrderModal' // import modal sửa
import DeleteOrderModal from './modal/DeleteOrderModal' // import modal xoá
import useOrder from '~/hooks/admin/useOrder'
import useDiscounts from '~/hooks/admin/useDiscount'
import { deleteOrderById } from '~/services/admin/orderService'
import useUsers from '~/hooks/admin/useUsers.js'
const OrderManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({}) // nếu cần lọc thì thêm filters
  const [openViewModal, setOpenViewModal] = React.useState(false)
  const [openEditModal, setOpenEditModal] = React.useState(false) // modal sửa
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false) // modal xoá
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
    updateOrderById
  } = useOrder()

  const { discounts, fetchDiscounts } = useDiscounts() // lấy danh sách mã giảm giá nếu cần
  const { users, fetchUsers } = useUsers()
  React.useEffect(() => {
    fetchUsers()
    fetchDiscounts()
  }, [])
  React.useEffect(() => {
    fetchOrders(page, limit, filters)
  }, [page, limit])
  // Mở modal xem
  const handleOpenModalView = async (order) => {
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

  // Mở modal sửa
  const handleOpenModalEdit = async (order) => {
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

  // Mở modal xoá
  const handleOpenModalDelete = (order) => {
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
    // Gọi API cập nhật (bạn cần tạo hàm updateOrder trong service tương tự)
    try {
      // Giả sử bạn có hàm updateOrderById trong service
      await updateOrderById(orderId, data)
      fetchOrders(page)
      handleCloseModalEdit()
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error)
    }
  }

  // Xử lý xoá đơn hàng
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return
    const success = await deleteOrderById(selectedOrder._id)
    if (success) {
      fetchOrders(page)
      handleCloseModalDelete()
    } else {
      alert('Xoá đơn hàng thất bại, vui lòng thử lại.')
    }
  }
  const handleChangePage = (event, value) => {
    setPage(value)
  }
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchOrders(1, limit, newFilters)
    }
  }

  return (
    <>
      <OrderTable
        orders={orders}
        loading={loading}
        onView={handleOpenModalView}
        onEdit={handleOpenModalEdit} // truyền sự kiện mở modal sửa
        onDelete={handleOpenModalDelete} // truyền sự kiện mở modal xoá
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
        onUpdate={handleUpdateOrder}
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
    </>
  )
}

export default OrderManagement
