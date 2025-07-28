let apiRoot = 'https://sunny-rhino-partly.ngrok-free.app'

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'https://sunny-rhino-partly.ngrok-free.app'
}

if (process.env.BUILD_MODE === 'prod') {
  // apiRoot = 'https://api-fashion-store.onrender.com'
  apiRoot = 'https://sunny-rhino-partly.ngrok-free.app'
}

// export const API_ROOT = 'http://localhost:8017'
export const API_ROOT = apiRoot

export const filterDate = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Hôm qua', value: 'yesterday' },
  { label: 'Tuần hiện tại', value: 'this_week' },
  { label: 'Tuần trước', value: 'last_week' },
  { label: 'Tháng hiện tại', value: 'this_month' },
  { label: 'Tháng trước', value: 'last_month' },
  { label: 'Quý hiện tại', value: 'this_quarter' },
  { label: 'Quý trước', value: 'last_quarter' },
  { label: 'Năm hiện tại', value: 'this_year' },
  { label: 'Năm trước', value: 'last_year' },
  { label: 'Tùy chỉnh', value: 'custom' }
]
export const GHN_TOKEN_API = '8062c850-4543-11f0-a61c-b20cbde7a816'

export const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
export const CLOUD_NAME = 'dkwsy9sph'

export const CloudinaryColor = 'color_upload'
export const CLOUD_FOLDER = 'user_avatar'
export const CloudinaryVideoFolder = 'video_upload'
export const CloudinaryImageFolder = 'image_upload'
export const CloudinaryCategory = 'category_upload'
export const CloudinaryProduct = 'product_upload'
