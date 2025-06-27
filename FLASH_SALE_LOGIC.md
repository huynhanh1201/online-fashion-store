# Logic Flash Sale - Quản lý giá sản phẩm

## Tổng quan
Hệ thống Flash Sale được thiết kế để quản lý giá sản phẩm một cách thông minh, đảm bảo giá trở về đúng giá ban đầu khi Flash Sale kết thúc.

## Giao diện quản lý

### Bảng Flash Sale
Bảng hiển thị các thông tin sau:
- **Sản phẩm:** Tên và ID sản phẩm
- **Giá gốc:** Giá ban đầu của sản phẩm (originalPrice)
- **Giá giảm ban đầu:** Giá khuyến mãi trước khi áp dụng Flash Sale (originalDiscountPrice)
- **Giá Flash:** Giá Flash Sale hiện tại (flashPrice)
- **Giảm giá:** Phần trăm giảm giá so với giá gốc và giá ban đầu
- **Số lượng:** Tồn kho sản phẩm
- **Thao tác:** Các nút chỉnh sửa, xóa, khôi phục giá

### Hiển thị giảm giá
- **Chip đỏ:** Giảm giá so với giá gốc (originalPrice → flashPrice)
- **Chip xanh:** Giảm giá so với giá ban đầu (originalDiscountPrice → flashPrice)

## Luồng hoạt động

### 1. Trạng thái ban đầu
- **Sản phẩm có giá:** `originalPrice = 50.000 VND`
- **Giá khuyến mãi hiện tại:** `discountPrice = 10.000 VND`
- **Giá gốc khuyến mãi:** `originalDiscountPrice = 0` (chưa được set)

### 2. Khi tạo Flash Sale
- **Người dùng nhập:** `flashPrice = 25.000 VND`
- **Hệ thống thực hiện:**
  ```javascript
  // Lưu giá khuyến mãi ban đầu
  originalDiscountPrice = discountPrice // = 10.000 VND
  
  // Thay thế hoàn toàn giá khuyến mãi
  discountPrice = flashPrice // = 25.000 VND
  ```

### 3. Trong thời gian Flash Sale
- **Giá hiển thị:** `25.000 VND` (giá Flash Sale)
- **Giá gốc được lưu:** `10.000 VND` (trong `originalDiscountPrice`)

### 4. Khi Flash Sale kết thúc
- **Hệ thống tự động khôi phục:**
  ```javascript
  discountPrice = originalDiscountPrice // = 10.000 VND
  ```

## Các tính năng

### Tự động khôi phục
- **Kiểm tra định kỳ:** Mỗi 5 phút
- **Điều kiện:** Flash Sale có `endTime < currentTime` và `status = 'active'`
- **Hành động:** Khôi phục giá về `originalDiscountPrice`

### Khôi phục thủ công
- **Nút khôi phục từng sản phẩm:** Chỉ hiển thị cho Flash Sale đã hết hạn
- **Nút khôi phục tất cả:** Khôi phục giá cho tất cả Flash Sale đã hết hạn

### Cập nhật giá Flash Sale
- **Khi chỉnh sửa:** Có thể thay đổi `flashPrice` và cập nhật `discountPrice`
- **Validation:** `flashPrice` phải < `originalPrice`

## Cấu trúc dữ liệu

### Variant Model
```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  originalPrice: Number,        // Giá gốc sản phẩm
  discountPrice: Number,        // Giá khuyến mãi hiện tại
  originalDiscountPrice: Number, // Giá khuyến mãi ban đầu (trước Flash Sale)
  // ... các trường khác
}
```

### Flash Sale Campaign
```javascript
{
  _id: ObjectId,
  title: String,
  startTime: Date,
  endTime: Date,
  status: String, // 'upcoming', 'active', 'expired', 'disabled'
  products: [{
    productId: ObjectId,
    flashPrice: Number,
    originalPrice: Number,
    originalDiscountPrice: Number // Giá khuyến mãi ban đầu
  }]
}
```

## API Endpoints

### Cập nhật giá Flash Sale
```
PUT /api/v1/variants/update-product-discount-price
Body: { productId, flashSalePrice }
```

### Khôi phục giá ban đầu
```
PUT /api/v1/variants/restore-product-original-discount-price
Body: { productId }
```

## Lưu ý quan trọng

1. **Giá ban đầu chỉ được lưu 1 lần:** Khi tạo Flash Sale đầu tiên
2. **Giá Flash Sale thay thế hoàn toàn:** `discountPrice` = `flashPrice`
3. **Khôi phục về giá ban đầu:** Không phải về 0
4. **Tự động + thủ công:** Hỗ trợ cả hai cách khôi phục
5. **Validation:** Đảm bảo giá Flash Sale < giá gốc
6. **Hiển thị rõ ràng:** Bảng hiển thị cả giá gốc, giá ban đầu và giá Flash Sale

## Ví dụ cụ thể

```
Ban đầu:
- originalPrice: 50.000 VND
- discountPrice: 10.000 VND
- originalDiscountPrice: 0

Tạo Flash Sale (25.000 VND):
- originalPrice: 50.000 VND
- discountPrice: 25.000 VND (thay thế)
- originalDiscountPrice: 10.000 VND (lưu giá cũ)

Kết thúc Flash Sale:
- originalPrice: 50.000 VND
- discountPrice: 10.000 VND (khôi phục)
- originalDiscountPrice: 10.000 VND (giữ nguyên)

Hiển thị trong bảng:
- Giá gốc: 50.000 VND
- Giá giảm ban đầu: 10.000 VND
- Giá Flash: 25.000 VND
- Giảm giá: -50% (so với giá gốc) / -150% (so với giá ban đầu)
``` 