const generateSequentialCode = async (prefix, zeroPadding, callback) => {
  const sequenceNumber = await callback(prefix)

  const paddedNumber = sequenceNumber.toString().padStart(zeroPadding, '0') // đảm bảo 01, 02,...

  return `${prefix}${paddedNumber}`
}

export default generateSequentialCode
