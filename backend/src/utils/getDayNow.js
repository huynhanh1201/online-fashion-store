const getDayNow = () => {
  // Lấy ngày tháng năm hiện tại
  const now = new Date()

  const day = now.getDate() // Lấy ngày (1 - 31)
  const month = now.getMonth() + 1 // Lấy tháng (0 - 11) => phải +1
  const year = now.getFullYear()

  return `${day}/${month}/${year}`
}

export default getDayNow
