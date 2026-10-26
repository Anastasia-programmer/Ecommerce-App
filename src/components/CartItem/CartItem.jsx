import { useDispatch } from 'react-redux'
import BookCover from '../BookCover/BookCover'
import Icon from '../Icon/Icon'
import QuantityStepper from '../QuantityStepper/QuantityStepper'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../redux/actions/cartActions'
import { formatPrice } from '../../utils/format'
import { MAX_QUANTITY } from '../../data/products'
import './CartItem.css'

/** One line of the basket. Receives the item (product + quantity) as a prop. */
export default function CartItem({ item }) {
  const dispatch = useDispatch()

  return (
    <li className="cart-item">
      <div className="cart-item__cover">
        <BookCover book={item} />
      </div>

      <div className="cart-item__info">
        <div className="cart-item__top">
          <div>
            <h4 className="cart-item__title">{item.title}</h4>
            <p className="cart-item__author">{item.author}</p>
          </div>
          <button
            type="button"
            className="cart-item__remove"
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label={`Remove ${item.title} from basket`}
          >
            <Icon name="trash" size={16} />
          </button>
        </div>

        <div className="cart-item__bottom">
          <QuantityStepper
            size="sm"
            quantity={item.quantity}
            max={MAX_QUANTITY}
            onIncrease={() => dispatch(increaseQuantity(item.id))}
            onDecrease={() => dispatch(decreaseQuantity(item.id))}
            label={`Quantity of ${item.title}`}
          />
          <div className="cart-item__prices">
            <span className="cart-item__total">{formatPrice(item.lineTotal)}</span>
            {item.quantity > 1 && <span className="cart-item__unit">{formatPrice(item.price)} each</span>}
          </div>
        </div>
      </div>
    </li>
  )
}
