const ghnToInternalStatusMap = {
  ready_to_pick: 'Pending',
  picking: 'Processing',
  picked: 'Processing',
  transporting: 'Shipping',
  delivering: 'Shipping',
  delivered: 'Delivered',
  cancel: 'Cancelled',
  delivery_fail: 'Failed',
  exception: 'Failed',
  lost: 'Failed'
}

function mapGhnStatusToInternal(statusFromGhn) {
  if (!statusFromGhn || typeof statusFromGhn !== 'string') return 'Pending'
  return ghnToInternalStatusMap[statusFromGhn.toLowerCase()] || 'Pending'
}

export const ghnStatus = {
  ghnToInternalStatusMap,
  mapGhnStatusToInternal
}
