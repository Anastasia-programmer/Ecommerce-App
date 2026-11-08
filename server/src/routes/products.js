import { Router } from 'express'
import mongoose from 'mongoose'
import { requireAuth } from '../middleware/auth.js'
import Product from '../models/Product.js'

const router = Router()

const FIELDS = ['name', 'author', 'description', 'price', 'category', 'imageUrl', 'stock']
const NOT_FOUND = { error: 'Product not found' }

// Keeps only the fields a client may set (ignores id, createdAt...)
const pickFields = (body = {}) => Object.fromEntries(FIELDS.filter((f) => f in body).map((f) => [f, body[f]]))

// A malformed id is treated like an unknown one
const findProduct = (id) => (mongoose.isValidObjectId(id) ? Product.findById(id) : null)

// GET /api/products — public
router.get('/', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  const product = await findProduct(req.params.id)
  if (!product) return res.status(404).json(NOT_FOUND)
  res.json(product)
})

// POST /api/products — JWT required
router.post('/', requireAuth, async (req, res) => {
  const product = await Product.create(pickFields(req.body))
  res.status(201).json(product)
})

// PUT /api/products/:id — JWT required
router.put('/:id', requireAuth, async (req, res) => {
  const product = await findProduct(req.params.id)
  if (!product) return res.status(404).json(NOT_FOUND)

  product.set(pickFields(req.body))
  await product.save() // runs the schema validators
  res.json(product)
})

// DELETE /api/products/:id — JWT required
router.delete('/:id', requireAuth, async (req, res) => {
  const product = await findProduct(req.params.id)
  if (!product) return res.status(404).json(NOT_FOUND)

  await product.deleteOne()
  res.json({ message: 'Product deleted', product })
})

export default router
