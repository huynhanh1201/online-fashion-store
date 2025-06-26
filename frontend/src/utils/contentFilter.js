// EditContent filter utility to prevent sensitive/inappropriate language
class ContentFilter {
  constructor() {
    // Vietnamese sensitive words list
    this.sensitiveWords = [
      // Profanity & Offensive
      'đồ',
      'đ*',
      'dm',
      'cmm',
      'cc',
      'vl',
      'vcl',
      'clmm',
      'đcm',
      'dcm',
      'đm',
      'đmm',
      'fuck',
      'shit',
      'damn',
      'bitch',
      'ass',
      'hell',
      'cứt',
      'chó',
      'lồn',
      'buồi',
      'cặc',
      'địt',
      'đụ',
      'mẹ mày',

      // Hate speech
      'thù hận',
      'kỳ thị',
      'phân biệt chủng tộc',
      'phân biệt tôn giáo',

      // Spam patterns
      'mua ngay',
      'khuyến mãi',
      'giảm giá',
      'link',
      'liên hệ',
      'zalo',
      'facebook',
      'telegram',
      'whatsapp',
      'số điện thoại',
      'sdt',
      'phone',

      // Inappropriate content
      'sex',
      'porn',
      'xxx',
      'adult',
      'nude',
      'naked',

      // Personal info patterns (basic)
      'email',
      '@gmail',
      '@yahoo',
      '@hotmail',
      'password',
      'mật khẩu',

      // Commercial spam
      'bán hàng',
      'quảng cáo',
      'marketing',
      'affiliate',
      'ref=',
      'utm_',
      'shopee',
      'tiki',
      'lazada',
      'sendo' // competing platforms
    ]

    // Warning words that should be flagged but not blocked
    this.warningWords = [
      'tệ',
      'dở',
      'kém',
      'tồi',
      'không tốt',
      'thất vọng',
      'không hài lòng',
      'chất lượng kém',
      'hàng fake',
      'hàng giả',
      'lừa đảo'
    ]

    // Patterns for phone numbers, emails, links
    this.patterns = {
      phone: /(\+84|0)[0-9]{8,9}|[0-9]{10,11}/g,
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      url: /(https?:\/\/[^\s]+|www\.[^\s]+|\.[a-z]{2,}\/[^\s]*)/gi,
      social:
        /(facebook\.com|fb\.com|instagram\.com|tiktok\.com|youtube\.com)/gi
    }
  }

  // Main filter function
  filterContent(text) {
    if (!text || typeof text !== 'string') {
      return {
        isValid: false,
        filteredText: '',
        violations: ['Nội dung không hợp lệ']
      }
    }

    const violations = []
    let filteredText = text.toLowerCase().trim()

    // Check for sensitive words
    const sensitiveViolations = this.checkSensitiveWords(filteredText)
    if (sensitiveViolations.length > 0) {
      violations.push(...sensitiveViolations)
    }

    // Check for patterns (phone, email, links)
    const patternViolations = this.checkPatterns(filteredText)
    if (patternViolations.length > 0) {
      violations.push(...patternViolations)
    }

    // Check for spam patterns
    const spamViolations = this.checkSpamPatterns(filteredText)
    if (spamViolations.length > 0) {
      violations.push(...spamViolations)
    }

    // Check for repetitive characters/words
    const repetitiveViolations = this.checkRepetitiveContent(filteredText)
    if (repetitiveViolations.length > 0) {
      violations.push(...repetitiveViolations)
    }

    // Check warnings (don't block but notify)
    const warnings = this.checkWarningWords(filteredText)

    return {
      isValid: violations.length === 0,
      filteredText: violations.length === 0 ? text : this.cleanText(text),
      violations,
      warnings,
      severity: this.calculateSeverity(violations)
    }
  }

  checkSensitiveWords(text) {
    const violations = []
    const normalizedText = this.normalizeText(text)

    for (const word of this.sensitiveWords) {
      const normalizedWord = this.normalizeText(word)
      if (normalizedText.includes(normalizedWord)) {
        violations.push(`Từ ngữ không phù hợp: "${word}"`)
      }
    }

    return violations
  }

  checkPatterns(text) {
    const violations = []

    // Check phone numbers
    if (this.patterns.phone.test(text)) {
      violations.push('Không được chia sẻ số điện thoại')
    }

    // Check emails
    if (this.patterns.email.test(text)) {
      violations.push('Không được chia sẻ địa chỉ email')
    }

    // Check URLs
    if (this.patterns.url.test(text)) {
      violations.push('Không được chia sẻ liên kết website')
    }

    // Check social media
    if (this.patterns.social.test(text)) {
      violations.push('Không được chia sẻ liên kết mạng xã hội')
    }

    return violations
  }

  checkSpamPatterns(text) {
    const violations = []

    // Check for excessive caps
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    if (capsRatio > 0.5 && text.length > 10) {
      violations.push('Quá nhiều chữ in hoa')
    }

    // Check for excessive punctuation
    const punctRatio = (text.match(/[!?.,;:]/g) || []).length / text.length
    if (punctRatio > 0.3) {
      violations.push('Quá nhiều dấu câu')
    }

    return violations
  }

  checkRepetitiveContent(text) {
    const violations = []

    // Check for repeated characters (more than 3 consecutive)
    if (/(.)\1{3,}/g.test(text)) {
      violations.push('Quá nhiều ký tự lặp lại')
    }

    // Check for repeated words
    const words = text.split(/\s+/)
    const wordCounts = {}
    for (const word of words) {
      if (word.length > 2) {
        wordCounts[word] = (wordCounts[word] || 0) + 1
        if (wordCounts[word] > 3) {
          violations.push('Quá nhiều từ lặp lại')
          break
        }
      }
    }

    return violations
  }

  checkWarningWords(text) {
    const warnings = []
    const normalizedText = this.normalizeText(text)

    for (const word of this.warningWords) {
      const normalizedWord = this.normalizeText(word)
      if (normalizedText.includes(normalizedWord)) {
        warnings.push(`Chú ý: "${word}"`)
      }
    }

    return warnings
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  cleanText(text) {
    let cleaned = text

    // Remove URLs
    cleaned = cleaned.replace(this.patterns.url, '[Link đã bị xóa]')

    // Remove emails
    cleaned = cleaned.replace(this.patterns.email, '[Email đã bị xóa]')

    // Remove phone numbers
    cleaned = cleaned.replace(this.patterns.phone, '[SĐT đã bị xóa]')

    // Replace sensitive words with asterisks
    for (const word of this.sensitiveWords) {
      const regex = new RegExp(
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'gi'
      )
      cleaned = cleaned.replace(regex, '*'.repeat(word.length))
    }

    return cleaned
  }

  calculateSeverity(violations) {
    if (violations.length === 0) return 'none'
    if (violations.length <= 2) return 'low'
    if (violations.length <= 4) return 'medium'
    return 'high'
  }

  // Suggest alternative words for common negative terms
  suggestAlternatives(text) {
    const suggestions = {
      tệ: 'chưa phù hợp',
      dở: 'cần cải thiện',
      kém: 'chưa đạt yêu cầu',
      tồi: 'chưa hài lòng',
      fake: 'không chính hãng',
      'lừa đảo': 'chưa tin cậy'
    }

    let suggestedText = text
    for (const [negative, positive] of Object.entries(suggestions)) {
      const regex = new RegExp(negative, 'gi')
      suggestedText = suggestedText.replace(regex, positive)
    }

    return suggestedText
  }
}

// Export singleton instance
export const contentFilter = new ContentFilter()
export default contentFilter
