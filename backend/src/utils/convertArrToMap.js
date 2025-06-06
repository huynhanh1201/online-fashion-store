const convertArrToMap = (arr, keySelector) => {
  const dataMap = {}
  arr.forEach((item) => {
    const clonedItem = { ...item }

    delete clonedItem[keySelector]

    console.log('[item[keySelector].toString(): ', item[keySelector].toString())

    return (dataMap[item[keySelector].toString()] = clonedItem)
  })
  return dataMap
}

export default convertArrToMap
