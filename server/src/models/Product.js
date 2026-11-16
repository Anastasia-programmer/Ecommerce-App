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

    // Optional display details used by the React shop
    oldPrice: { type: Number, min: [0, 'oldPrice cannot be negative'] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    year: Number,
    pages: Number,
    language: { type: String, trim: true },
    tag: { type: String, trim: true }, // badge: Bestseller, New, Award, Classic
    coverTitle: String, // title written on the cover, e.g. in Arabic
    coverAuthor: String,
    cover: { bg: String, fg: String, accent: String, pattern: String, layout: String, rtl: Boolean },
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
