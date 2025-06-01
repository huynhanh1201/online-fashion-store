import mongoose from 'mongoose'
import dayjs from 'dayjs'

import { WarehouseSlipModel } from '~/models/WarehouseSlipsModel'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { VariantModel } from '~/models/VariantModel'
import { InventoryModel } from '~/models/InventoryModel'
import { BatchModel } from '~/models/BatchModel'
import { InventoryLogModel } from '~/models/InventoryLogModel'
import { StatusCodes } from 'http-status-codes'
import apiError from '~/utils/ApiError'

const createWarehouseSlip = async (reqBody, jwtDecoded) => {
  // eslint-disable-next-line no-useless-catch
  const session = await mongoose.startSession()
  try {
    // 🧾 1. Bắt đầu giao dịch
    session.startTransaction()
    let result = null
    if (reqBody.type === 'import') {
      result = await importStockWarehouseSlip(reqBody, jwtDecoded, session)
    } else if (reqBody.type === 'export') {
      result = await exportStockWarehouseSlip(reqBody, jwtDecoded, session)
    }

    // 🧾 2. Xác nhận thành công
    await session.commitTransaction()

    return result
  } catch (err) {
    // 3. Có lỗi xảy ra → rollback
    await session.abortTransaction()
    throw err
  } finally {
    // 4. Đóng session
    session.endSession()
  }
}

const getWarehouseSlipList = async () => {
  const result = await WarehouseSlipModel.find({ destroy: false })
    .populate([
      { path: 'partnerId', select: 'name' },
      { path: 'warehouseId', select: 'name' }
    ])
    .lean()

  return result
}

const getWarehouseSlip = async (warehouseSlipId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await WarehouseSlipModel.findOne({
      _id: warehouseSlipId,
      destroy: false
    })
      .populate([
        { path: 'partnerId', select: 'name' },
        { path: 'warehouseId', select: 'name' }
      ])
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateWarehouseSlip = async (warehouseSlipId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedWarehouseSlip = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      reqBody,
      { new: true }
    )

    return updatedWarehouseSlip
  } catch (err) {
    throw err
  }
}

const deleteWarehouseSlip = async (warehouseSlipId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const warehouseSlipDeleted = await WarehouseSlipModel.findOneAndUpdate(
      { _id: warehouseSlipId },
      { destroy: true },
      { new: true }
    )

    return warehouseSlipDeleted
  } catch (err) {
    throw err
  }
}

const importStockWarehouseSlip = async (reqBody, jwtDecoded, session) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Tạo slipId theo định dạng PNK-YYYYMMDD-0001 hoặc PXK-YYYYMMDD-0001
    const date = dayjs(reqBody.date).format('YYYYMMDD') // "20250628"

    const prefixSlipId = `PNK-${date}-`

    const slipId = await generateSequentialCode(
      prefixSlipId,
      4,
      async (prefixSlipId) => {
        // Query mã lớn nhất đã có với prefixSlipId đó
        const regex = new RegExp(`^${prefixSlipId}(\\d{4})$`)
        const latest = await WarehouseSlipModel.findOne({
          slipId: { $regex: regex }
        })
          .sort({ slipId: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.slipId.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    // Lấy thông thi user đã thao tác

    // #1 Tạo phiếu Xuất/Nhập kho
    const warehouseSlipInfo = {
      type: reqBody.type,
      date: reqBody.date,
      partnerId: reqBody.partnerId,
      warehouseId: reqBody.warehouseId,
      items: reqBody.items,
      note: reqBody.note,

      slipId: slipId,
      createdBy: {
        _id: jwtDecoded._id,
        name: jwtDecoded.name,
        role: jwtDecoded.role,
        email: jwtDecoded.email
      },
      destroy: false
    }

    const [warehouseSlip] = await WarehouseSlipModel.create(
      [warehouseSlipInfo],
      {
        session
      }
    )

    // #2 Cập nhật số lượng tồn kho của sản phẩm
    // Tạo variantMap để dễ dàng lấy variant từ id
    const variantIds = reqBody.items.map((item) => item.variantId)

    const variants = await VariantModel.find({
      _id: { $in: variantIds }
    }).session(session)

    const variantMap = variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = variant
      return acc
    }, {})

    // Tải trước toàn bộ tồn kho trong kho này
    // Tạo inventoriesMap để dễ dàng lấy variant từ id
    const existingInventories = await InventoryModel.find({
      variantId: { $in: variantIds },
      warehouseId: reqBody.warehouseId
    })

    const inventoryMap = existingInventories.reduce((acc, inventory) => {
      acc[inventory.variantId.toString()] = inventory
      return acc
    }, {})

    // Mảng để lưu các bản ghi tồn kho đã được cập nhật hoặc tạo mới
    const inventoriesUpdated = []

    for (const item of reqBody.items) {
      const variantId = item.variantId.toString()

      const variant = variantMap[variantId]

      if (!variant) continue

      const existingInventory = inventoryMap[variantId]

      if (existingInventory) {
        // CASE 1: Inventory đã tồn tại

        // Cập nhật tồn kho bằng cách cộng thêm delta
        existingInventory.quantity += item.quantity

        // Lưu lại thay đổi vào DB (có dùng session của transaction)
        await existingInventory.save({ session })

        // Đẩy vào danh sách cập nhật
        inventoriesUpdated.push(existingInventory)
      } else {
        // CASE 2: Inventory chưa tồn tại

        const inventoryInfo = {
          variantId: item.variantId,
          warehouseId: reqBody.warehouseId,
          quantity: item.quantity,
          minQuantity: variant.minQuantity, // Lấy từ variant gốc
          importPrice: variant.importPrice,
          exportPrice: variant.exportPrice,
          status: variant.status,
          destroy: false
        }

        // Nếu là phiếu nhập và chưa có tồn kho, thì tạo mới tồn kho
        const [newInventory] = await InventoryModel.create(
          [inventoryInfo],
          { session } // Quan trọng: dùng session để đảm bảo nằm trong transaction
        )

        // Cập nhật map tồn kho để các vòng lặp sau không phải tạo lại
        inventoryMap[variantId] = newInventory

        // Thêm vào danh sách tồn kho đã cập nhật
        inventoriesUpdated.push(newInventory)
      }
    }

    // #3 Tạo lô biến thể khi nhập/xuất
    const prefixBatchCode = `LOT-${date}-`
    const batchDocs = []
    const batchMap = {}

    // Chưa có thì query DB lần đầu
    const regex = new RegExp(`^${prefixBatchCode}(\\d{4})$`)
    const latest = await BatchModel.findOne({
      batchCode: { $regex: regex }
    })
      .sort({ batchCode: -1 }) // sort batchCode giảm dần
      .lean()

    let lastNumber = 0 // lưu số thứ tự lớn nhất đã tạo trong vòng for này

    for (let i = 0; i < reqBody.items.length; i++) {
      const variant = variantMap[reqBody.items[i].variantId.toString()]

      if (variant) {
        const batchCode = await generateSequentialCode(
          prefixBatchCode,
          4,
          async () => {
            if (lastNumber > 0) {
              return lastNumber + 1
            }
            let nextNumber = 1
            if (latest) {
              const match = latest.batchCode.match(regex)

              if (match && match[1]) {
                nextNumber = parseInt(match[1], 10) + 1
              }
            }
            lastNumber = nextNumber
            return nextNumber
          }
        )

        const batchInfo = {
          variantId: variant._id,
          warehouseId: reqBody.warehouseId,
          batchCode: batchCode,
          manufactureDate: null,
          expiry: null,
          quantity: reqBody.items[i].quantity,
          importPrice: variant.importPrice,
          importedAt: reqBody.date,
          destroy: false
        }

        const [batchCreated] = await BatchModel.create([batchInfo], { session })
        batchDocs.push(batchCreated)
        // Lưu vào batchMap với key dạng "variantId-index"
        batchMap[`${variant._id}-${i}`] = batchCreated // vì create() trả mảng
      }
    }

    // #4 Ghi lịch sử Xuất/Nhập
    const inventoryLogs = []

    for (let i = 0; i < reqBody.items.length; i++) {
      const item = reqBody.items[i]
      const variantId = item.variantId.toString()

      const inventory = inventoryMap[variantId]
      const batch = batchMap ? batchMap[`${variantId}-${i}`] : null // nếu bạn lưu theo dạng map

      if (!inventory) continue // tránh ghi log sai

      const delta = item.quantity

      inventoryLogs.push({
        inventoryId: inventory._id,
        batchId: batch ? batch._id : null,
        type: 'in',
        source: warehouseSlip.slipId,
        amount: delta,
        importPrice: inventory.importPrice,
        exportPrice: inventory.exportPrice,
        note: reqBody.note,
        createdBy: {
          _id: jwtDecoded._id,
          name: jwtDecoded.name,
          role: jwtDecoded.role,
          email: jwtDecoded.email
        },
        createdAt: reqBody.date
      })
    }

    await InventoryLogModel.insertMany(inventoryLogs, { session })

    return warehouseSlip
  } catch (err) {
    throw err
  }
}

const exportStockWarehouseSlip = async (reqBody, jwtDecoded, session) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Tạo slipId theo định dạng PNK-YYYYMMDD-0001 hoặc PXK-YYYYMMDD-0001
    const date = dayjs(reqBody.date).format('YYYYMMDD') // "20250628"

    const prefixSlipId = `PXK-${date}-`

    const slipId = await generateSequentialCode(
      prefixSlipId,
      4,
      async (prefixSlipId) => {
        // Query mã lớn nhất đã có với prefixSlipId đó
        const regex = new RegExp(`^${prefixSlipId}(\\d{4})$`)
        const latest = await WarehouseSlipModel.findOne({
          slipId: { $regex: regex }
        })
          .sort({ slipId: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.slipId.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    // Lấy thông thi user đã thao tác

    // #1 Tạo phiếu Xuất/Nhập kho
    const warehouseSlipInfo = {
      type: reqBody.type,
      date: reqBody.date,
      partnerId: reqBody.partnerId,
      warehouseId: reqBody.warehouseId,
      items: reqBody.items,
      note: reqBody.note,

      slipId: slipId,
      createdBy: {
        _id: jwtDecoded._id,
        name: jwtDecoded.name,
        role: jwtDecoded.role,
        email: jwtDecoded.email
      },
      destroy: false
    }

    const [warehouseSlip] = await WarehouseSlipModel.create(
      [warehouseSlipInfo],
      {
        session
      }
    )

    // #2 Xác thực tồn kho và Cập nhật số lượng

    const variantIds = reqBody.items.map((item) => item.variantId.toString())

    const inventoris = await InventoryModel.find({
      variantId: { $in: variantIds },
      warehouseId: reqBody.warehouseId
    })

    const inventoryMap = inventoris.reduce((acc, inventory) => {
      acc[inventory.variantId.toString()] = inventory
      return acc
    }, {})

    const reqBodyItemsMap = {}

    for (let item of reqBody.items) {
      const existingInventory = inventoryMap[item.variantId.toString()]
      existingInventory.quantity -= item.quantity
      if (existingInventory.quantity < 0) {
        throw new apiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          'Số lượng xuất vượt quá số lượng tồn.'
        )
      }

      await existingInventory.save({ session })
      reqBodyItemsMap[item.variantId.toString()] = item
    }

    // #3 Trừ số lượng trong lô theo quy tác FIFO
    const batchesSortedByOldest = await BatchModel.find({
      variantId: { $in: variantIds },
      warehouseId: reqBody.warehouseId,
      quantity: { $gt: 0 },
      destroy: false
    }).sort({ importedAt: 1 })

    const batchesUsed = [] // danh sách các lô đã dùng để xuất, dùng để ghi log

    for (const batch of batchesSortedByOldest) {
      const reqBodyItems = reqBodyItemsMap[batch.variantId.toString()]
      if (reqBodyItems.quantity <= 0) break

      const availableBatch = batch.quantity

      const used = Math.min(availableBatch, reqBodyItems.quantity)

      batch.quantity -= used
      await batch.save({ session })

      batchesUsed.push({
        batchId: batch._id,
        quantity: used,
        inventoryId: batch.inventoryId,
        importPrice: batch.importPrice,
        inventory: inventoryMap[batch.variantId.toString()]
      })

      reqBodyItems.quantity -= used
    }

    // #4 Ghi log vào inventoryLogs
    const inventoryLogs = batchesUsed.map((batchesUsed) => ({
      inventoryId: batchesUsed.inventory._id,
      batchId: batchesUsed.batchId,
      type: 'out',
      source: warehouseSlip.slipId,
      amount: -batchesUsed.quantity,
      importPrice: batchesUsed.importPrice,
      exportPrice: batchesUsed.inventory.exportPrice,
      note: reqBody.note,
      createdBy: {
        _id: jwtDecoded._id,
        name: jwtDecoded.name,
        role: jwtDecoded.role,
        email: jwtDecoded.email
      },
      createdAt: reqBody.date
    }))

    // Insert nhiều log 1 lần
    await InventoryLogModel.insertMany(inventoryLogs, { session })

    return warehouseSlip
  } catch (err) {
    throw err
  }
}

export const warehouseSlipsService = {
  createWarehouseSlip,
  getWarehouseSlipList,
  getWarehouseSlip,
  updateWarehouseSlip,
  deleteWarehouseSlip,
  importStockWarehouseSlip,
  exportStockWarehouseSlip
}
