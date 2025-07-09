// Trước hết, cài dayjs và plugin nếu chưa có:
// npm install dayjs dayjs-plugin-utc dayjs-plugin-timezone

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Kích hoạt plugin
dayjs.extend(utc)
dayjs.extend(timezone)

// Khai báo múi giờ cố định
const ZONE = 'Asia/Ho_Chi_Minh'

/**
 * Trả về { startDate: Date|null, endDate: Date|null }
 * dựa vào filterTypeDate (type) và (nếu custom) rawStart/rawEnd.
 * Sử dụng dayjs để thao tác ngày giờ cho dễ.
 */
function getDateRange(type, rawStart, rawEnd) {
  // Lấy thời điểm hiện tại theo múi giờ Asia/Ho_Chi_Minh
  const now = dayjs().tz(ZONE)

  // Khởi tạo 2 biến dayjs để chứa start/end (ban đầu null)
  let start = null
  let end = null

  switch (type) {
    case 'today': {
      // ====== Hôm nay ======
      // start = today 00:00:00.000
      // end   = today 23:59:59.999
      start = now.startOf('day')
      end = now.endOf('day')
      break
    }

    case 'yesterday': {
      // ====== Hôm qua ======
      const y = now.subtract(1, 'day')
      start = y.startOf('day')
      end = y.endOf('day')
      break
    }

    case 'this_week': {
      // ====== Tuần này (thứ Hai → Chủ nhật) ======
      // dayjs().startOf('week') theo mặc định bắt đầu Chủ nhật,
      // ta muốn tuần bắt đầu Thứ Hai nên dùng add/subtract:
      // Cách đơn giản: xác định offset đến Thứ Hai như bên dưới:

      // rawDow = 0..6 (0=CN,1=T2,...6=T7)
      const rawDow = now.day()
      // offsetToMonday = số ngày phải lùi để ra Thứ Hai
      const offsetToMonday = (rawDow + 6) % 7
      // monday = thời điểm Thứ Hai 00:00 tuần này
      const monday = now.subtract(offsetToMonday, 'day').startOf('day')
      // sunday = Thứ Hai + 6 ngày, rồi endOf('day')
      const sunday = monday.add(6, 'day').endOf('day')

      start = monday
      end = sunday
      break
    }

    case 'last_week': {
      // ====== Tuần trước ======
      // Bước 1: tính Thứ Hai tuần này (giống case this_week)
      const rawDow = now.day()
      const offsetToMonday = (rawDow + 6) % 7
      const mondayThis = now.subtract(offsetToMonday, 'day').startOf('day')
      // Bước 2: lùi tiếp 7 ngày để được Thứ Hai tuần trước
      const mondayLast = mondayThis.subtract(7, 'day').startOf('day')
      // Bước 3: cộng 6 ngày cho Chủ nhật tuần trước
      const sundayLast = mondayLast.add(6, 'day').endOf('day')

      start = mondayLast
      end = sundayLast
      break
    }

    case 'this_month': {
      // ====== Tháng này ======
      // startOf('month') → ngày đầu tháng 00:00
      // endOf('month')   → ngày cuối tháng 23:59:59.999
      start = now.startOf('month')
      end = now.endOf('month')
      break
    }

    case 'last_month': {
      // ====== Tháng trước ======
      // Bước 1: lùi 1 tháng rồi startOf('month')
      const lm = now.subtract(1, 'month')
      start = lm.startOf('month')
      end = lm.endOf('month')
      break
    }

    case 'this_quarter': {
      // ====== Quý này ======
      // Xác định quý hiện tại theo month:
      const m = now.month() // 0..11
      const startQ = Math.floor(m / 3) * 3 // 0, 3, 6 hoặc 9

      // Tạo dayjs tại ngày 1 của tháng startQ ở đầu quý
      const firstOfQuarter = dayjs()
        .tz(ZONE)
        .year(now.year())
        .month(startQ)
        .date(1)
        .startOf('day')

      // Tính ngày cuối quý: +3 tháng rồi .date(0) (ngày "0" tháng kế là ngày cuối tháng trước)
      const lastOfQuarter = firstOfQuarter.add(3, 'month').date(0).endOf('day')

      start = firstOfQuarter
      end = lastOfQuarter
      break
    }

    case 'last_quarter': {
      // ====== Quý trước ======
      // Bước 1: xác định quý hiện tại
      const curQ = Math.floor(now.month() / 3) + 1 // 1..4
      let tq = curQ - 1
      let ty = now.year()
      if (tq < 1) {
        // đang là Q1 → quý trước là Q4 năm trước
        tq -= 1 // (ví dụ Q1-1=0 → set thành 4, nhưng ta xử lý lại next)
        tq = 4
        ty -= 1
      }
      // Từ targetQuarter → xác định tháng đầu kỳ
      const startQ = (tq - 1) * 3 // 0,3,6,9

      // Tạo dayjs cho ngày 1 tháng startQ của targetYear
      const firstOfLastQ = dayjs()
        .tz(ZONE)
        .year(ty)
        .month(startQ)
        .date(1)
        .startOf('day')

      // Ngày cuối kỳ = +3 tháng rồi date(0) → set endOf('day')
      const lastOfLastQ = firstOfLastQ.add(3, 'month').date(0).endOf('day')

      start = firstOfLastQ
      end = lastOfLastQ
      break
    }

    case 'this_year': {
      // ====== Năm này ======
      // startOf('year') = ngày 1 tháng 1 năm hiện tại 00:00
      // endOf('year')   = ngày 31 tháng 12 năm hiện tại 23:59:59.999
      start = now.startOf('year')
      end = now.endOf('year')
      break
    }

    case 'last_year': {
      // ====== Năm trước ======
      const ly = now.subtract(1, 'year')
      start = ly.startOf('year')
      end = ly.endOf('year')
      break
    }

    case 'custom': {
      // ====== Tùy chọn (Custom Range) ======
      // FE phải gửi thêm rawStart/rawEnd (chuỗi YYYY-MM-DD hoặc ISO)
      if (rawStart) {
        // dayjs(rawStart).tz(ZONE) để parse đúng múi giờ Asia/Ho_Chi_Minh,
        // rồi startOf('day') = ngày rawStart 00:00:00.000
        start = dayjs(rawStart).tz(ZONE).startOf('day')
      }
      if (rawEnd) {
        // endOf('day') = ngày rawEnd 23:59:59.999
        end = dayjs(rawEnd).tz(ZONE).endOf('day')
      }
      break
    }

    default: {
      // Nếu không khớp type nào (vd: FE gửi sai giá trị), trả null để không lọc theo ngày
      start = null
      end = null
      break
    }
  }

  // Convert về JavaScript Date (nếu không null), rồi trả về
  return {
    startDate: start ? start.toDate() : null,
    endDate: end ? end.toDate() : null
  }
}

export default getDateRange
