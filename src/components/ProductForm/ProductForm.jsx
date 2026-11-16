import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Icon from '../Icon/Icon'
import { createProduct, updateProduct } from '../../redux/actions/productActions'
import { showToast } from '../../redux/actions/uiActions'
import { CATEGORIES } from '../../data/products'
import './ProductForm.css'

const EMPTY_FORM = { name: '', author: '', category: CATEGORIES[0], price: '', stock: '', description: '' }

// Pre-fills the form when editing an existing book
const toForm = (product) => ({
  name: product.name,
  author: product.author ?? '',
  category: product.category,
  price: String(product.price),
  stock: String(product.stock ?? 0),
  description: product.description,
})

/**
 * Form to add a book (POST /api/products) or edit one (PUT /api/products/:id).
 * Props: `product` to edit (null to add a new one), `onDone` to close the form.
 * Local state: the fields, the API error message and the "saving" flag.
 */
export default function ProductForm({ product, onDone }) {
  const dispatch = useDispatch()
  const isEdit = product !== null

  const [form, setForm] = useState(() => (isEdit ? toForm(product) : EMPTY_FORM))
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsSaving(true)

    const data = { ...form, price: Number(form.price), stock: Number(form.stock || 0) }
    try {
      if (isEdit) {
        await dispatch(updateProduct(product.id, data))
        dispatch(showToast(`“${data.name}” updated`))
      } else {
        await dispatch(createProduct(data))
        dispatch(showToast(`“${data.name}” added to the catalog`))
      }
      onDone()
    } catch (err) {
      // The API validation message, e.g. "price cannot be negative"
      setError(err.message)
      setIsSaving(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2 className="product-form__title">{isEdit ? `Edit “${product.name}”` : 'Add a book'}</h2>

      <div className="product-form__grid">
        <label className="field">
          <span>Title</span>
          <input value={form.name} onChange={update('name')} required />
        </label>
        <label className="field">
          <span>Author</span>
          <input value={form.author} onChange={update('author')} />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <div className="product-form__pair">
          <label className="field">
            <span>Price (DA)</span>
            <input type="number" min="0" value={form.price} onChange={update('price')} required />
          </label>
          <label className="field">
            <span>Stock</span>
            <input type="number" min="0" value={form.stock} onChange={update('stock')} />
          </label>
        </div>
        <label className="field product-form__wide">
          <span>Description</span>
          <textarea rows="3" value={form.description} onChange={update('description')} required />
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="product-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onDone} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSaving}>
          <Icon name="check" size={16} />
          {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Add the book'}
        </button>
      </div>
    </form>
  )
}
