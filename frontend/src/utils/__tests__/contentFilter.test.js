// Test cases for content filter
import { contentFilter } from '../contentFilter'

// Test cases
const testCases = [
  // Valid content
  {
    input: 'Sản phẩm rất tốt, chất lượng tuyệt vời!',
    expected: { isValid: true, violations: [] }
  },
  {
    input: 'Hàng đẹp, giao nhanh, tôi rất hài lòng',
    expected: { isValid: true, violations: [] }
  },

  // Sensitive words
  {
    input: 'Sản phẩm đồ nát, chất lượng cc',
    expected: { isValid: false, violations: ['Từ ngữ không phù hợp'] }
  },
  {
    input: 'Fuck this product',
    expected: { isValid: false, violations: ['Từ ngữ không phù hợp'] }
  },

  // Phone numbers
  {
    input: 'Liên hệ tôi qua số 0901234567',
    expected: { isValid: false, violations: ['Không được chia sẻ số điện thoại'] }
  },
  {
    input: 'Gọi +84901234567 để mua hàng',
    expected: { isValid: false, violations: ['Không được chia sẻ số điện thoại'] }
  },

  // Email addresses
  {
    input: 'Email tôi: test@gmail.com',
    expected: { isValid: false, violations: ['Không được chia sẻ địa chỉ email'] }
  },

  // URLs
  {
    input: 'Xem thêm tại https://example.com',
    expected: { isValid: false, violations: ['Không được chia sẻ liên kết website'] }
  },
  {
    input: 'Vào www.google.com để tìm hiểu',
    expected: { isValid: false, violations: ['Không được chia sẻ liên kết website'] }
  },

  // Social media
  {
    input: 'Follow tôi trên facebook.com/mypage',
    expected: { isValid: false, violations: ['Không được chia sẻ liên kết mạng xã hội'] }
  },

  // Spam patterns
  {
    input: 'MUA NGAY HÔM NAY!!!',
    expected: { isValid: false, violations: ['Quá nhiều chữ in hoa'] }
  },
  {
    input: 'Tệệệệệệ quáááá',
    expected: { isValid: false, violations: ['Quá nhiều ký tự lặp lại'] }
  },

  // Warning words (should not block but warn)
  {
    input: 'Sản phẩm hơi tệ nhưng vẫn dùng được',
    expected: { isValid: true, warnings: ['Chú ý'] }
  }
]

// Test function
export const runContentFilterTests = () => {
  console.log('🔍 Testing Content Filter...')

  let passed = 0
  let failed = 0

  testCases.forEach((testCase, index) => {
    const result = contentFilter.filterContent(testCase.input)

    const isValidMatch = result.isValid === testCase.expected.isValid
    const hasExpectedViolations = testCase.expected.violations.length === 0 ||
      result.violations.some(v => testCase.expected.violations.some(ev => v.includes(ev)))

    if (isValidMatch && hasExpectedViolations) {
      console.log(`✅ Test ${index + 1}: PASSED`)
      console.log(`   Input: "${testCase.input}"`)
      console.log(`   Valid: ${result.isValid}`)
      if (result.violations.length > 0) {
        console.log(`   Violations: ${result.violations.join(', ')}`)
      }
      if (result.warnings && result.warnings.length > 0) {
        console.log(`   Warnings: ${result.warnings.join(', ')}`)
      }
      passed++
    } else {
      console.log(`❌ Test ${index + 1}: FAILED`)
      console.log(`   Input: "${testCase.input}"`)
      console.log(`   Expected valid: ${testCase.expected.isValid}, Got: ${result.isValid}`)
      console.log(`   Expected violations: ${testCase.expected.violations.join(', ')}`)
      console.log(`   Got violations: ${result.violations.join(', ')}`)
      failed++
    }
    console.log('')
  })

  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`)
  return { passed, failed, total: testCases.length }
}

// Manual test examples
export const manualTestExamples = [
  // Good examples
  'Sản phẩm chất lượng tốt, giá cả hợp lý',
  'Đóng gói cẩn thận, giao hàng nhanh',
  'Tôi rất hài lòng với sản phẩm này',

  // Bad examples that should be caught
  'Sản phẩm đồ nát, lừa đảo khách hàng',
  'Liên hệ zalo 0901234567 để mua hàng rẻ hơn',
  'Email tôi abc@gmail.com nếu cần',
  'Xem shopee.vn/mystore để mua rẻ hơn',
  'Fuck this shit product',
  'MUA NGAY KẺO HẾT HÀNG!!!!!',

  // Edge cases
  'Sản phẩm ổn nhưng có thể cải thiện thêm',
  'Chất lượng không như mong đợi nhưng vẫn dùng được',
  'Hơi thất vọng nhưng sẽ thử lần nữa'
]

// Export for use in console
if (typeof window !== 'undefined') {
  window.testContentFilter = runContentFilterTests
  window.manualTestExamples = manualTestExamples
  window.contentFilter = contentFilter
}