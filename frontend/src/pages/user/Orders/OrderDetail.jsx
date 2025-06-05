import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useOrderDetail } from '~/hooks/useOrderDetail';
import ReviewModal from './modal/ReviewModal';

// Định nghĩa các nhãn trạng thái đơn hàng
const statusLabels = {
  Pending: ['Đang chờ', 'warning'],
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, items, loading, error } = useOrderDetail(orderId);

  // State cho modal - Đặt trước tất cả các return
  const [openReviewModal, setOpenReviewModal] = useState(false);

  // Kiểm tra trạng thái loading, error hoặc không tìm thấy đơn hàng
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Lỗi: {error.message || 'Có lỗi xảy ra'}</Typography>;
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>;

  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default'];

  // Tính tổng tiền hàng và thành tiền
  const totalProductsPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalAmount = totalProductsPrice - (order.discountAmount || 0);
  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫';

  // Logic hiển thị nút
  const isPaid = order.paymentStatus === 'paid'; // Giả sử order.paymentStatus là 'paid' hoặc 'unpaid'
  const isOrderCompleted = order.status === 'Delivered'; // Đơn hàng đã giao
  const isOrderCancellable = ['Pending', 'Processing'].includes(order.status) && !isPaid; // Đơn hàng có thể hủy

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    try {
      console.log('Hủy đơn hàng:', orderId);
      navigate('/orders');
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
    }
  };

  // Mở modal đánh giá
  const handleReviewProduct = () => {
    setOpenReviewModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenReviewModal(false);
  };

  // Xử lý submit đánh giá
  const handleSubmitReview = async (reviewData) => {
    try {
      const fullReviewData = {
        orderId,
        ...reviewData,
      };
      console.log('Gửi đánh giá:', fullReviewData);
      handleCloseModal();
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" p={2} sx={{ minHeight: '70vh' }}>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => navigate(-1)} aria-label="Quay lại">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" ml={1}>Đơn hàng: {order._id}</Typography>
          <Chip label={label} color={color} sx={{ ml: 'auto' }} />
        </Box>

        <Typography fontWeight="bold">Thông tin người nhận:</Typography>
        <Typography>{order.shippingAddress?.fullName} - {order.shippingAddress?.phone}</Typography>
        <Typography>{order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold" mb={1}>Sản phẩm đã mua:</Typography>
        {items.map((item) => (
          <Box key={item._id} mb={2} display="flex" gap={2} alignItems="center">
            <Avatar
              src={item.color?.image || '/default.jpg'}
              variant="square"
              sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" flex={1}>
              <Box textAlign="left">
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Phân loại hàng: {item.color?.name}, {item.size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  x{item.quantity}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body1">{item.price?.toLocaleString('vi-VN')} ₫</Typography>
                {item.originalPrice && item.originalPrice > item.price && (
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    {item.originalPrice?.toLocaleString('vi-VN')} ₫
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Tổng tiền hàng:</Typography>
          <Typography>{formatPrice(totalProductsPrice)}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Phí vận chuyển:</Typography>
          <Typography>{formatPrice(0)}</Typography>
        </Box>

        {order.couponId ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontWeight="bold">Mã giảm giá:</Typography>
            <Typography color="error">{formatPrice(order.discountAmount || 0)}</Typography>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontWeight="bold">Mã giảm giá:</Typography>
            <Typography>0 ₫</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Thành tiền:</Typography>
          <Typography fontWeight="bold" variant="h5">
            {formatPrice(finalAmount > 0 ? finalAmount : 0)}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography fontWeight="bold">Phương thức thanh toán:</Typography>
          <Typography>
            {order.paymentMethod?.toLowerCase() === 'cod'
              ? 'Thanh toán khi nhận hàng (COD)'
              : 'VNPay'}
          </Typography>
        </Box>
      </Paper>
      <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
        {isOrderCancellable && (
          <Button
            variant="contained"
            color="warning"
            onClick={handleCancelOrder}
          >
            Hủy đơn hàng
          </Button>
        )}
        {(isOrderCompleted || isPaid) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewProduct}
          >
            Đánh giá sản phẩm
          </Button>
        )}
      </Box>

      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        orderItems={items}
      />
    </Box>
  );
};

export default OrderDetail;