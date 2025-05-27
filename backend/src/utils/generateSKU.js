import { remove as removeDiacritics } from 'diacritics'

export default function generateSKU(value1, value2, value3) {
  const productCode = removeDiacritics(value1)
    .toUpperCase()
    .replace(/\s+/g, '-')
  const colorCode = removeDiacritics(value2).toUpperCase().replace(/\s+/g, '')
  const value3Code = value3.toUpperCase()

  return `${productCode}-${colorCode}-${value3Code}`
}
