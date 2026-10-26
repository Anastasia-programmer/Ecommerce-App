import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BookCover from '../BookCover/BookCover'
import Icon from '../Icon/Icon'
import Price from '../Price/Price'
import QuantityStepper from '../QuantityStepper/QuantityStepper'
import RatingStars from '../RatingStars/RatingStars'
import { addToCart } from '../../redux/actions/cartActions'
import { toggleFavorite } from '../../redux/actions/favoritesActions'
import { showToast } from '../../redux/actions/uiActions'
import { selectIsFavorite, selectProductById, selectQuantityInCart } from '../../redux/selectors'
import { formatPrice } from '../../utils/format'
import { MAX_QUANTITY } from '../../data/products'
import './ProductDetails.css'

/**
 * Product details dialog.
 * Local state: the quantity chosen before adding to the basket.
 * Global state: the product, its quantity already in the cart, favorite status.
 */
export default function ProductDetails({ productId, onClose }) {
  const dispatch = useDispatch()
  const product = useSelector((state) => selectProductById(state, productId))
  const inCart = useSelector((state) => selectQuantityInCart(state, productId))
  const isFavorite = useSelector((state) => selectIsFavorite(state, productId))

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const closeRef = useRef(null)

  const remaining = MAX_QUANTITY - inCart
  const canAdd = remaining > 0

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!justAdded) return undefined
    const timer = setTimeout(() => setJustAdded(false), 1600)
    return () => clearTimeout(timer)
  }, [justAdded])

  if (!product) return null

  const handleAdd = () => {
    const added = Math.min(quantity, remaining)
    dispatch(addToCart(product.id, added))
    dispatch(showToast(`${added} × “${product.title}” added to your basket`, { showCartLink: true }))
    setQuantity(1)
    setJustAdded(true)
  }

  const specs = [
    ['Published', product.year],
    ['Pages', product.pages],
    ['Language', product.language],
    ['Category', product.category],
  ]

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="product-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        onMouseDown={(event) => event.stopPropagation()}
        style={{ '--tint': product.cover.bg }}
      >
        <button ref={closeRef} type="button" className="icon-btn product-details__close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>

        <div className="product-details__visual">
          <BookCover book={product} />
        </div>

        <div className="product-details__info">
          <p className="product-details__meta">
            {product.category} <span aria-hidden="true">·</span> {product.language}
          </p>
          <h2 id="product-details-title" className="product-details__title">
            {product.title}
          </h2>
          <p className="product-details__author">by {product.author}</p>
          <RatingStars rating={product.rating} reviews={product.reviews} size={16} />

          <p className="product-details__description">{product.description}</p>

          <dl className="product-details__specs">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="product-details__purchase">
            <div className="product-details__price">
              <Price price={product.price} oldPrice={product.oldPrice} size="lg" showBadge />
              {product.oldPrice && (
                <p className="product-details__saving">You save {formatPrice(product.oldPrice - product.price)}</p>
              )}
            </div>

            <div className="product-details__actions">
              <QuantityStepper
                quantity={quantity}
                max={Math.max(remaining, 1)}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => q - 1)}
              />
              <button
                type="button"
                className={`btn btn--primary product-details__add ${justAdded ? 'is-added' : ''}`}
                onClick={handleAdd}
                disabled={!canAdd}
              >
                <Icon name={justAdded ? 'check' : 'bag'} size={18} />
                {!canAdd ? 'Maximum reached' : justAdded ? 'Added!' : `Add · ${formatPrice(product.price * quantity)}`}
              </button>
              <button
                type="button"
                className={`icon-btn product-details__fav ${isFavorite ? 'is-active' : ''}`}
                onClick={() => dispatch(toggleFavorite(product.id))}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Icon name="heart" filled={isFavorite} />
              </button>
            </div>

            {inCart > 0 && (
              <p className="product-details__in-cart">
                <Icon name="check" size={16} /> {inCart} already in your basket
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
