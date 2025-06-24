import { URI, CLOUD_NAME, CloudinaryImageFolder } from './constants.js'

export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return ''

  const { width = 400, height = 400, quality = 'auto', format = 'auto', crop = 'fill' } = options

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transformation = `f_${format},q_${quality},w_${width},h_${height},c_${crop}`
  return `${parts[0]}/upload/${transformation}/${parts[1]}`
}

export const uploadImageToCloudinary = async (file, folder = CloudinaryImageFolder) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default') // Bạn cần tạo upload preset trong Cloudinary
    formData.append('folder', folder)
    formData.append('cloud_name', CLOUD_NAME)

    const response = await fetch(URI, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
