import { useDispatch, useSelector } from 'react-redux'
import BookCover from '../BookCover/BookCover'
import Icon from '../Icon/Icon'
import Price from '../Price/Price'
import QuantityStepper from '../QuantityStepper/QuantityStepper'
import RatingStars from '../RatingStars/RatingStars'
import { addToCart, decreaseQuantity, increaseQuantity } from '../../redux/actions/cartActions'
import { toggleFavorite } from '../../redux/actions/favoritesActions'
import { showToast } from '../../redux/actions/uiActions'
import { selectIsFavorite, selectQuantityInCart } from '../../redux/selectors'
import { discountPercent } from '../../utils/format'
import { MAX_QUANTITY } from '../../data/products'
import './ProductCard.css'

const TAG_STYLES = { Bestseller: 'gold', New: 'green', Award: 'primary', Classic: 'dark' }

/**
 * One product of the catalog.
 * Props: the product to display + a callback to open its details.
 * Global state: reads its cart quantity / favorite status and dispatches actions.
 */
export default function ProductCard({ product, onOpenDetails, index = 0 }) {
  const dispatch = useDispatch()
  const quantity = useSelector((state) => selectQuantityInCart(state, product.id))
  const isFavorite = useSelector((state) => selectIsFavorite(state, product.id))

  const discount = discountPercent(product.price, product.oldPrice)
  const badge = discount ? { label: `−${discount}%`, style: 'sale' } : product.tag && { label: product.tag, style: TAG_STYLES[product.tag] }

  const handleAdd = () => {
    dispatch(addToCart(product.id))
    dispatch(showToast(`“${product.title}” added to your basket`, { showCartLink: true }))
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product.id))
    dispatch(showToast(isFavorite ? 'Removed from favorites' : `“${product.title}” saved to favorites`))
  }

  return (
    <article className="product-card" style={{ '--i': index, '--tint': product.cover.bg }}>
      <div className="product-card__media">
        <button
          type="button"
          className="product-card__cover"
          onClick={() => onOpenDetails(product.id)}
          aria-label={`View details of ${product.title}`}
        >
          <BookCover book={product} />
        </button>

        {badge && <span className={`product-card__badge product-card__badge--${badge.style}`}>{badge.label}</span>}

        <button
          type="button"
          className={`product-card__fav ${isFavorite ? 'is-active' : ''}`}
          onClick={handleToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
        >
          <Icon name="heart" size={18} filled={isFavorite} />
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__meta">
          {product.category} <span aria-hidden="true">·</span> {product.year}
        </p>
        <h3 className="product-card__title">
          <button type="button" onClick={() => onOpenDetails(product.id)}>
            {product.title}
          </button>
        </h3>
        <p className="product-card__author">{product.author}</p>
        <RatingStars rating={product.rating} reviews={product.reviews} />

        <div className="product-card__footer">
          <Price price={product.price} oldPrice={product.oldPrice} />
          {quantity > 0 ? (
            <QuantityStepper
              size="sm"
              quantity={quantity}
              max={MAX_QUANTITY}
              showRemoveIcon
              onIncrease={() => dispatch(increaseQuantity(product.id))}
              onDecrease={() => dispatch(decreaseQuantity(product.id))}
              label={`Quantity of ${product.title} in basket`}
            />
          ) : (
            <button type="button" className="btn btn--primary btn--sm product-card__add" onClick={handleAdd}>
              <Icon name="bag" size={16} />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
