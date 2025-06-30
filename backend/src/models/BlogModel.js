import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      default: null
    },
    images: {
      type: [String],
      default: []
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        default: ''
      }
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      default: null,
      trim: true
    },
    type: {
      type: String,
      enum: ['blog', 'policy'],
      default: 'blog'
    },
    brand: {
      type: String,
      default: null,
      trim: true
    },
    publishedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'active'],
      default: 'draft'
    },
    meta: {
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      keywords: {
        type: [String],
        default: []
      }
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    destroy: {
      type: Boolean,
      default: false
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const BlogModel = model('Blog', blogSchema)
