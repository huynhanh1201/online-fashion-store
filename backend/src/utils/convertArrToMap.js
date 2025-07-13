const convertArrToMap = (arr, keySelector) => {
  const dataMap = {}
  arr.forEach((item) => {
    const clonedItem = { ...item }

    delete clonedItem[keySelector]

    return (dataMap[item[keySelector].toString()] = clonedItem)
  })
  return dataMap
}

export default convertArrToMap
