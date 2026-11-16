import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '../components/EmptyState/EmptyState'
import Icon from '../components/Icon/Icon'
import ProductForm from '../components/ProductForm/ProductForm'
import { deleteProduct } from '../redux/actions/productActions'
import { showToast } from '../redux/actions/uiActions'
import { selectIsLoggedIn, selectProducts, selectProductsStatus } from '../redux/selectors'
import { formatPrice } from '../utils/format'
import './Pages.css'

/**
 * Catalog management for logged-in users: add, edit and delete books.
 * Every change is sent to the API with the user's JWT, then saved in MongoDB.
 * Local state: which form is open, and the book being deleted.
 */
export default function ManagePage({ onNavigate }) {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const products = useSelector(selectProducts)
  const status = useSelector(selectProductsStatus)

  // undefined = no form, null = "add" form, a product = "edit" form
  const [editedProduct, setEditedProduct] = useState(undefined)
  const [deletingId, setDeletingId] = useState(null)

  if (!isLoggedIn) {
    return (
      <section className="container page-section page-section--top">
        <EmptyState
          icon="shield"
          title="Sign in to manage the catalog"
          action={
            <button type="button" className="btn btn--primary" onClick={() => onNavigate('account')}>
              <Icon name="user" size={16} />
              Sign in
            </button>
          }
        >
          Adding, editing and deleting books requires an account: the API only accepts these requests with a
          valid JWT.
        </EmptyState>
      </section>
    )
  }

  const openForm = (product) => {
    setEditedProduct(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete “${product.title}” from the catalog?`)) return
    setDeletingId(product.id)
    try {
      await dispatch(deleteProduct(product.id))
      dispatch(showToast(`“${product.title}” deleted`))
    } catch (err) {
      dispatch(showToast(`Could not delete the book: ${err.message}`))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="container page-section page-section--top">
      <div className="section-head">
        <div>
          <p className="section-head__eyebrow">Admin</p>
          <h1 className="section-head__title">Manage the books</h1>
          <p className="section-head__count">{products.length} books in the database</p>
        </div>
        {editedProduct === undefined && (
          <button type="button" className="btn btn--primary" onClick={() => openForm(null)}>
            <Icon name="plus" size={16} />
            Add a book
          </button>
        )}
      </div>

      {editedProduct !== undefined && (
        <ProductForm
          key={editedProduct?.id ?? 'new'}
          product={editedProduct}
          onDone={() => setEditedProduct(undefined)}
        />
      )}

      {status === 'failed' ? (
        <EmptyState icon="shield" title="Could not load the books">
          The API is not reachable. Start it and reload the page.
        </EmptyState>
      ) : (
        <div className="manage-table">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.title}</strong>
                    <span>{product.author}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td className="manage-table__actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => openForm(product)}
                      aria-label={`Edit ${product.title}`}
                      title="Edit"
                    >
                      <Icon name="edit" size={18} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn manage-table__delete"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      aria-label={`Delete ${product.title}`}
                      title="Delete"
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
