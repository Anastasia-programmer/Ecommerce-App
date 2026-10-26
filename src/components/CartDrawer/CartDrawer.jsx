import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../CartItem/CartItem'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import { clearCart } from '../../redux/actions/cartActions'
import { closeCart, showToast } from '../../redux/actions/uiActions'
import { selectCartCount, selectCartItems, selectCartTotals, selectIsCartOpen } from '../../redux/selectors'
import { formatPrice } from '../../utils/format'
import './CartDrawer.css'

/**
 * Slide-in shopping basket.
 * Global state: open/closed, cart items and totals (all derived from the store).
 * Local state: the confirmation shown after the (demo) checkout.
 */
export default function CartDrawer() {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectIsCartOpen)
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const totals = useSelector(selectCartTotals)

  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const closeRef = useRef(null)

  const handleClose = () => {
    dispatch(closeCart())
    setConfirmedOrder(null)
  }

  useEffect(() => {
    if (!isOpen) return undefined
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        dispatch(closeCart())
        setConfirmedOrder(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, dispatch])

  const handleCheckout = () => {
    setConfirmedOrder({ count, total: totals.total })
    dispatch(clearCart())
  }

  const handleClear = () => {
    dispatch(clearCart())
    dispatch(showToast('Your basket has been emptied'))
  }

  return (
    <div className={`cart-drawer ${isOpen ? 'is-open' : ''}`} inert={!isOpen}>
      <div className="cart-drawer__backdrop" onClick={handleClose} />

      <aside className="cart-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart-drawer__header">
          <h2 id="cart-title">
            Your basket
            {count > 0 && <span className="cart-drawer__count">{count}</span>}
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={handleClose} aria-label="Close basket">
            <Icon name="close" />
          </button>
        </header>

        {confirmedOrder ? (
          <div className="cart-drawer__confirmation">
            <div className="cart-drawer__check">
              <Icon name="check" size={32} strokeWidth={2.4} />
            </div>
            <h3>Thank you!</h3>
            <p>
              Your order of <strong>{confirmedOrder.count} book{confirmedOrder.count > 1 ? 's' : ''}</strong> for{' '}
              <strong>{formatPrice(confirmedOrder.total)}</strong> has been registered.
            </p>
            <p className="cart-drawer__demo-note">
              <Icon name="shield" size={16} /> Demo store — no payment is processed.
            </p>
            <button type="button" className="btn btn--primary" onClick={handleClose}>
              Continue browsing
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="bag"
            title="Your basket is empty"
            action={
              <button type="button" className="btn btn--primary" onClick={handleClose}>
                Browse books
                <Icon name="arrowRight" size={18} />
              </button>
            }
          >
            Find your next read on the shelf — add a book and it will appear here.
          </EmptyState>
        ) : (
          <>
            <div className="cart-drawer__shipping">
              <p>
                <Icon name="truck" size={18} />
                {totals.remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong>{formatPrice(totals.remainingForFreeShipping)}</strong> more for free delivery
                  </span>
                ) : (
                  <span>
                    <strong>Free delivery</strong> unlocked
                  </span>
                )}
              </p>
              <div className="cart-drawer__progress" aria-hidden="true">
                <span style={{ width: `${totals.freeShippingProgress * 100}%` }} />
              </div>
            </div>

            <ul className="cart-drawer__items">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>

            <footer className="cart-drawer__footer">
              <dl className="cart-drawer__summary">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.savings > 0 && (
                  <div className="is-saving">
                    <dt>Discounts included</dt>
                    <dd>−{formatPrice(totals.savings)}</dd>
                  </div>
                )}
                <div>
                  <dt>Delivery</dt>
                  <dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
                </div>
                <div className="is-total">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              <button type="button" className="btn btn--primary btn--block cart-drawer__checkout" onClick={handleCheckout}>
                Checkout
                <Icon name="arrowRight" size={18} />
              </button>
              <button type="button" className="cart-drawer__clear" onClick={handleClear}>
                <Icon name="trash" size={15} />
                Empty basket
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
