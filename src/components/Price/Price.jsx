import { discountPercent, formatPrice } from '../../utils/format'
import './Price.css'

/** Price with optional old price and discount percentage. */
export default function Price({ price, oldPrice, size = 'md', showBadge = false }) {
  const discount = discountPercent(price, oldPrice)

  return (
    <div className={`price price--${size}`}>
      <span className="price__current">{formatPrice(price)}</span>
      {oldPrice && (
        <>
          <s className="price__old">{formatPrice(oldPrice)}</s>
          {showBadge && <span className="price__badge">−{discount}%</span>}
        </>
      )}
    </div>
  )
}
