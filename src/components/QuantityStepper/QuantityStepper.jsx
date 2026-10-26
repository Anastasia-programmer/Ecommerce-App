import Icon from '../Icon/Icon'
import './QuantityStepper.css'

/**
 * Reusable − / + control. It does not know about Redux:
 * the parent decides what happens through the onIncrease / onDecrease props.
 */
export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10,
  showRemoveIcon = false,
  size = 'md',
  label = 'Quantity',
}) {
  const atMin = quantity <= min
  const useTrash = showRemoveIcon && quantity === 1

  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={onDecrease}
        disabled={atMin && !useTrash}
        aria-label={useTrash ? 'Remove' : 'Decrease quantity'}
      >
        <Icon name={useTrash ? 'trash' : 'minus'} size={size === 'sm' ? 14 : 16} />
      </button>
      <span className="stepper__value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="stepper__btn"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  )
}
