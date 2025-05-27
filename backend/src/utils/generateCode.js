import { slugify } from '~/utils/formatters'

const generateGetPrefix = (data) => {
  const prefix = slugify(data, { lower: true }) // bỏ dấu, gạch ngang
    .trim()
    .split('-')
    .map((item) => item.charAt(0).toUpperCase())
    .join('')

  return prefix
}

const generate = (prefix, number, numberZero = 5) => {
  const paddedNumber = number.toString().padStart(numberZero, '0') // đảm bảo 01, 02,...

  return `${prefix}${paddedNumber}`
}

export const generateCode = {
  generate,
  generateGetPrefix
}
