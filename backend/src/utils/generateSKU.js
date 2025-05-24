import { remove as removeDiacritics } from 'diacritics'

export default function generateSKU(productName, colorName, size) {
  const productCode = removeDiacritics(productName)
    .toUpperCase()
    .replace(/\s+/g, '-')
  const colorCode = removeDiacritics(colorName)
    .toUpperCase()
    .replace(/\s+/g, '')
  const sizeCode = size.toUpperCase()

  return `${productCode}-${colorCode}-${sizeCode}`
}
