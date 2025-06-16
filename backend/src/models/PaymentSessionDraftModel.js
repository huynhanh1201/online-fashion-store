import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const paymentSessionDraftSchema = new Schema(
  {
    orderId: { type: Schema.Types.Mixed },
    cartItems: { type: Schema.Types.Mixed },
    variantMap: { type: Schema.Types.Mixed },
    order: { type: Schema.Types.Mixed },
    reqBody: { type: Schema.Types.Mixed },
    userId: { type: Schema.Types.Mixed },
    variantIds: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const PaymentSessionDraftModel = model(
  'PaymentSessionDraft',
  paymentSessionDraftSchema
)
