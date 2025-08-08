// customLocale.js
import vi from 'date-fns/locale/vi'

const customVi = {
  ...vi,
  localize: {
    ...vi.localize,
    day: (n) => {
      const days = ['C', 'H', 'B', 'T', 'N', 'S', 'B'] // Chủ nhật đến thứ bảy
      return days[n]
    }
  }
}

export default customVi
