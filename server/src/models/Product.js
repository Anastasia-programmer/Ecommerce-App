import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    author: { type: String, trim: true, default: '' },
    description: { type: String, required: [true, 'description is required'], trim: true },
    price: { type: Number, required: [true, 'price is required'], min: [0, 'price cannot be negative'] },
    category: { type: String, required: [true, 'category is required'], trim: true },
    imageUrl: { type: String, trim: true, default: '' },
    stock: { type: Number, default: 0, min: [0, 'stock cannot be negative'] },
  },
  {
    timestamps: true,
    // JSON sent to clients uses `id` instead of `_id`, like the React catalog
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id
      },
    },
  },
)

export default mongoose.model('Product', productSchema)
