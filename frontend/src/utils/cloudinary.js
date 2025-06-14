export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return ''

  const { width = 400, height = 400, quality = 'auto', format = 'auto', crop = 'fill' } = options

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const transformation = `f_${format},q_${quality},w_${width},h_${height},c_${crop}`
  return `${parts[0]}/upload/${transformation}/${parts[1]}`
}
