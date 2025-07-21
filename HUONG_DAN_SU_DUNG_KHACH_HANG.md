# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ THỜI TRANG
## Dành cho Khách Hàng

---

## 📋 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Đăng ký và Đăng nhập](#2-đăng-ký-và-đăng-nhập)
3. [Trang chủ và Điều hướng](#3-trang-chủ-và-điều-hướng)
4. [Tìm kiếm và Duyệt sản phẩm](#4-tìm-kiếm-và-duyệt-sản-phẩm)
5. [Chi tiết sản phẩm](#5-chi-tiết-sản-phẩm)
6. [Giỏ hàng](#6-giỏ-hàng)
7. [Thanh toán](#7-thanh-toán)
8. [Quản lý đơn hàng](#8-quản-lý-đơn-hàng)
9. [Hồ sơ cá nhân](#9-hồ-sơ-cá-nhân)
10. [Blog và Tin tức](#10-blog-và-tin-tức)
11. [Hỗ trợ khách hàng](#11-hỗ-trợ-khách-hàng)

---

## 1. TỔNG QUAN HỆ THỐNG

### 🎯 Giới thiệu
Hệ thống thương mại điện tử thời trang hiện đại với giao diện thân thiện, cung cấp trải nghiệm mua sắm trực tuyến hoàn chỉnh.

### ✨ Tính năng chính
- **Duyệt sản phẩm**: Xem danh sách sản phẩm theo danh mục
- **Tìm kiếm thông minh**: Tìm kiếm sản phẩm theo tên, danh mục
- **Giỏ hàng**: Quản lý sản phẩm muốn mua
- **Thanh toán**: Đa dạng phương thức thanh toán
- **Theo dõi đơn hàng**: Xem trạng thái đơn hàng
- **Quản lý tài khoản**: Cập nhật thông tin cá nhân
- **Blog**: Đọc tin tức thời trang

---

## 2. ĐĂNG KÝ VÀ ĐĂNG NHẬP

### 📝 Đăng ký tài khoản mới

#### Bước 1: Truy cập trang đăng ký
- Nhấp vào nút **"Đăng ký"** trên header
- URL: `/register`

#### Bước 2: Điền thông tin
```
📧 Email: Nhập email hợp lệ
🔒 Mật khẩu: Tối thiểu 6 ký tự
👤 Họ tên: Nhập họ tên đầy đủ
📱 Số điện thoại: Nhập số điện thoại
```

#### Bước 3: Xác thực email
- Kiểm tra email để nhận mã xác thực
- Nhập mã xác thực tại `/account/verification`

### 🔐 Đăng nhập

#### Cách đăng nhập:
1. Nhấp **"Đăng nhập"** trên header
2. Nhập email và mật khẩu
3. Nhấp **"Đăng nhập"**

#### Lưu ý:
- Hệ thống tự động lưu phiên đăng nhập
- Có thể đăng xuất bất cứ lúc nào

---

## 3. TRANG CHỦ VÀ ĐIỀU HƯỚNG

### 🏠 Cấu trúc trang chủ

#### Header (Thanh điều hướng trên)
```
🏪 Logo cửa hàng
🔍 Thanh tìm kiếm
🛒 Giỏ hàng (hiển thị số lượng)
👤 Tài khoản (Đăng nhập/Đăng ký)
```

#### Menu chính
- **Trang chủ**: `/`
- **Sản phẩm**: `/product`
- **Danh mục**: `/category/:slug`
- **Sản phẩm mới**: `/productnews`
- **Blog**: `/blog`
- **Chính sách**: `/policy`

#### Nội dung trang chủ
1. **Slider**: Banner quảng cáo chính
2. **Liên hệ**: Thông tin liên hệ nhanh
3. **ChatBot**: Hỗ trợ trực tuyến
4. **Nội dung**: Giới thiệu về cửa hàng
5. **Sản phẩm nổi bật**: Danh sách sản phẩm hot
6. **Blog**: Tin tức thời trang mới nhất

#### Footer (Chân trang)
- Thông tin công ty
- Liên kết hữu ích
- Chính sách bảo mật
- Điều khoản sử dụng

---

## 4. TÌM KIẾM VÀ DUYỆT SẢN PHẨM

### 🔍 Tìm kiếm sản phẩm

#### Cách tìm kiếm:
1. **Thanh tìm kiếm**: Nhập từ khóa vào ô tìm kiếm trên header
2. **Kết quả**: Chuyển đến `/searchresult` với danh sách sản phẩm

#### Tính năng tìm kiếm:
- Tìm theo tên sản phẩm
- Tìm theo danh mục
- Gợi ý từ khóa tự động

### 📂 Duyệt theo danh mục

#### Cách duyệt:
1. **Menu danh mục**: Chọn danh mục từ menu
2. **Trang danh mục**: `/category/:slug`
3. **Sản phẩm theo danh mục**: `/productbycategory/:categoryId`

#### Tính năng lọc và sắp xếp:
```
🏷️ Lọc theo giá
📊 Sắp xếp theo:
   - Mới nhất
   - Giá thấp đến cao
   - Giá cao đến thấp
   - Bán chạy nhất
```

### 📄 Phân trang
- Hiển thị 15 sản phẩm mỗi trang
- Điều hướng trang dễ dàng
- Hiển thị tổng số sản phẩm

---

## 5. CHI TIẾT SẢN PHẨM

### 🛍️ Trang chi tiết sản phẩm
URL: `/productdetail/:productId`

#### Thông tin hiển thị:
1. **Hình ảnh sản phẩm**
   - Ảnh chính và ảnh phụ
   - Zoom ảnh chi tiết
   - Xem ảnh toàn màn hình

2. **Thông tin cơ bản**
   ```
   📝 Tên sản phẩm
   💰 Giá bán (có thể có giá khuyến mãi)
   ⭐ Đánh giá và số lượt đánh giá
   📦 Tình trạng kho
   🏷️ Danh mục sản phẩm
   ```

3. **Tùy chọn sản phẩm**
   ```
   🎨 Màu sắc: Chọn màu có sẵn
   📏 Kích thước: Chọn size phù hợp
   🔢 Số lượng: Tăng/giảm số lượng
   ```

4. **Hành động**
   ```
   🛒 Thêm vào giỏ hàng
   💳 Mua ngay
   ❤️ Yêu thích
   📤 Chia sẻ
   ```

#### Thông tin chi tiết:
- **Mô tả sản phẩm**: Thông tin chi tiết về sản phẩm
- **Hướng dẫn size**: Bảng size chi tiết
- **Đánh giá**: Nhận xét từ khách hàng khác
- **Sản phẩm liên quan**: Gợi ý sản phẩm tương tự

#### Voucher và khuyến mãi:
- Hiển thị voucher có thể áp dụng
- Thông tin khuyến mãi đặc biệt

---

## 6. GIỎ HÀNG

### 🛒 Quản lý giỏ hàng
URL: `/cart` (Yêu cầu đăng nhập)

#### Chức năng chính:
1. **Xem sản phẩm trong giỏ**
   ```
   🖼️ Hình ảnh sản phẩm
   📝 Tên và thông tin sản phẩm
   🎨 Màu sắc và kích thước đã chọn
   💰 Giá và tổng tiền
   🔢 Số lượng
   ```

2. **Chỉnh sửa giỏ hàng**
   ```
   ➕ Tăng số lượng
   ➖ Giảm số lượng
   🗑️ Xóa sản phẩm
   ☑️ Chọn sản phẩm để thanh toán
   ```

3. **Tính năng nâng cao**
   ```
   🏷️ Áp dụng mã giảm giá
   💰 Tính tổng tiền tự động
   📦 Ước tính phí vận chuyển
   ```

#### Gợi ý sản phẩm:
- Hiển thị sản phẩm liên quan
- Sản phẩm được mua cùng

#### Hành động:
```
🛍️ Tiếp tục mua sắm
💳 Thanh toán
🗑️ Xóa tất cả
```

---

## 7. THANH TOÁN

### 💳 Quy trình thanh toán
URL: `/payment` (Yêu cầu đăng nhập)

#### Bước 1: Thông tin giao hàng
```
📍 Địa chỉ giao hàng:
   - Chọn địa chỉ có sẵn
   - Thêm địa chỉ mới
   
📝 Thông tin người nhận:
   - Họ tên
   - Số điện thoại
   - Ghi chú đặc biệt
```

#### Bước 2: Phương thức vận chuyển
```
🚚 Tùy chọn vận chuyển:
   - Giao hàng tiêu chuẩn
   - Giao hàng nhanh
   - Giao hàng siêu tốc
```

#### Bước 3: Phương thức thanh toán
```
💰 Các phương thức:
   - Thanh toán khi nhận hàng (COD)
   - Chuyển khoản ngân hàng
   - Ví điện tử VNPay
   - Thẻ tín dụng/ghi nợ
```

#### Bước 4: Xác nhận đơn hàng
```
📋 Tóm tắt đơn hàng:
   - Danh sách sản phẩm
   - Tổng tiền hàng
   - Phí vận chuyển
   - Giảm giá (nếu có)
   - Tổng thanh toán
```

#### Kết quả thanh toán:
- **Thành công**: Chuyển đến `/order-success`
- **Thất bại**: Chuyển đến `/payment-failed`
- **VNPay**: Xử lý tại `/payment-result`

---

## 8. QUẢN LÝ ĐỚN HÀNG

### 📦 Danh sách đơn hàng
URL: `/orders` (Yêu cầu đăng nhập)

#### Thông tin đơn hàng:
```
🔢 Mã đơn hàng
📅 Ngày đặt hàng
💰 Tổng tiền
📊 Trạng thái đơn hàng:
   - Chờ xác nhận
   - Đã xác nhận
   - Đang chuẩn bị
   - Đang giao hàng
   - Đã giao hàng
   - Đã hủy
```

#### Hành động với đơn hàng:
```
👁️ Xem chi tiết
❌ Hủy đơn hàng (nếu được phép)
🔄 Đặt lại đơn hàng
📞 Liên hệ hỗ trợ
```

### 📋 Chi tiết đơn hàng
URL: `/order-detail/:orderId`

#### Thông tin chi tiết:
1. **Thông tin đơn hàng**
   ```
   🔢 Mã đơn hàng
   📅 Ngày đặt
   📊 Trạng thái hiện tại
   💳 Phương thức thanh toán
   ```

2. **Thông tin giao hàng**
   ```
   📍 Địa chỉ giao hàng
   👤 Người nhận
   📱 Số điện thoại
   🚚 Phương thức vận chuyển
   ```

3. **Danh sách sản phẩm**
   ```
   🖼️ Hình ảnh
   📝 Tên sản phẩm
   🎨 Màu sắc, kích thước
   🔢 Số lượng
   💰 Đơn giá và thành tiền
   ```

4. **Tổng kết thanh toán**
   ```
   💰 Tổng tiền hàng
   🚚 Phí vận chuyển
   🏷️ Giảm giá
   💳 Tổng thanh toán
   ```

#### Theo dõi đơn hàng:
- Timeline trạng thái đơn hàng
- Thông tin vận chuyển
- Dự kiến thời gian giao hàng

---

## 9. HỒ SƠ CÁ NHÂN

### 👤 Quản lý tài khoản
URL: `/profile` (Yêu cầu đăng nhập)

#### Thông tin cá nhân:
```
📧 Email
👤 Họ tên
📱 Số điện thoại
🎂 Ngày sinh
👨‍👩‍👧‍👦 Giới tính
```

#### Địa chỉ giao hàng:
```
📍 Quản lý địa chỉ:
   - Thêm địa chỉ mới
   - Chỉnh sửa địa chỉ
   - Xóa địa chỉ
   - Đặt địa chỉ mặc định
```

#### Bảo mật tài khoản:
```
🔒 Đổi mật khẩu
🔐 Xác thực hai yếu tố
📱 Quản lý thiết bị đăng nhập
```

#### Tùy chọn cá nhân:
```
🔔 Cài đặt thông báo
📧 Đăng ký nhận email
🌐 Ngôn ngữ hiển thị
```

---

## 10. BLOG VÀ TIN TỨC

### 📰 Trang blog
URL: `/blog`

#### Nội dung blog:
```
👗 Xu hướng thời trang
💡 Mẹo phối đồ
🛍️ Hướng dẫn mua sắm
🎨 Bảng màu thời trang
📸 Lookbook mới nhất
```

#### Tính năng:
- Đọc bài viết đầy đủ
- Chia sẻ bài viết
- Bình luận và tương tác
- Tìm kiếm bài viết

### 📖 Chi tiết bài viết
URL: `/blog/:blogId`

#### Nội dung bài viết:
```
📝 Tiêu đề và nội dung
📅 Ngày đăng
👤 Tác giả
🏷️ Danh mục bài viết
📊 Lượt xem và chia sẻ
```

#### Tương tác:
- Đọc bài viết liên quan
- Chia sẻ lên mạng xã hội
- Để lại bình luận

---

## 11. HỖ TRỢ KHÁCH HÀNG

### 💬 Chatbot hỗ trợ
- Hỗ trợ 24/7 trên trang chủ
- Trả lời câu hỏi thường gặp
- Hướng dẫn sử dụng website

### 📞 Liên hệ trực tiếp
```
📧 Email hỗ trợ
📱 Hotline
💬 Chat trực tuyến
📍 Địa chỉ cửa hàng
```

### ❓ Câu hỏi thường gặp

#### Về đặt hàng:
- Làm thế nào để đặt hàng?
- Có thể thay đổi đơn hàng không?
- Thời gian xử lý đơn hàng?

#### Về thanh toán:
- Các phương thức thanh toán?
- Bảo mật thông tin thanh toán?
- Hoàn tiền như thế nào?

#### Về vận chuyển:
- Thời gian giao hàng?
- Phí vận chuyển?
- Theo dõi đơn hàng?

#### Về sản phẩm:
- Chính sách đổi trả?
- Bảo hành sản phẩm?
- Hướng dẫn chọn size?

---

## 🎯 TỔNG KẾT

### Quy trình mua hàng hoàn chỉnh:
```
1. 🔍 Tìm kiếm/Duyệt sản phẩm
2. 👁️ Xem chi tiết sản phẩm
3. 🛒 Thêm vào giỏ hàng
4. 💳 Thanh toán
5. 📦 Theo dõi đơn hàng
6. ✅ Nhận hàng và đánh giá
```

### Lợi ích cho khách hàng:
- **Giao diện thân thiện**: Dễ sử dụng, trực quan
- **Tìm kiếm thông minh**: Nhanh chóng, chính xác
- **Thanh toán đa dạng**: Nhiều phương thức lựa chọn
- **Theo dõi đơn hàng**: Minh bạch, cập nhật realtime
- **Hỗ trợ 24/7**: Chatbot và đội ngũ hỗ trợ

### Bảo mật và tin cậy:
- Mã hóa thông tin cá nhân
- Bảo mật giao dịch thanh toán
- Chính sách bảo mật rõ ràng
- Đánh giá từ khách hàng thực

---

## 📞 LIÊN HỆ HỖ TRỢ

Nếu cần hỗ trợ thêm, vui lòng liên hệ:
- **Email**: support@fashionstore.com
- **Hotline**: 1900-xxxx
- **Chat**: Sử dụng chatbot trên website
- **Giờ làm việc**: 8:00 - 22:00 (Thứ 2 - Chủ nhật)

---

*Cảm ơn bạn đã sử dụng hệ thống của chúng tôi! 🛍️*