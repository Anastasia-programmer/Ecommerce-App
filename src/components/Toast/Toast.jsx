import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from '../Icon/Icon'
import { hideToast, openCart } from '../../redux/actions/uiActions'
import { selectToast } from '../../redux/selectors'
import './Toast.css'

const DURATION = 2800

/** Short notification shown after an action (e.g. "added to your basket"). */
export default function Toast() {
  const dispatch = useDispatch()
  const toast = useSelector(selectToast)

  // Restart the timer each time a new toast (new id) is shown.
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => dispatch(hideToast()), DURATION)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div className="toast-region" role="status" aria-live="polite">
      <div key={toast.id} className="toast">
        <span className="toast__icon">
          <Icon name="check" size={14} strokeWidth={2.6} />
        </span>
        <span className="toast__message">{toast.message}</span>
        {toast.showCartLink && (
          <button
            type="button"
            className="toast__action"
            onClick={() => {
              dispatch(openCart())
              dispatch(hideToast())
            }}
          >
            View
          </button>
        )}
      </div>
    </div>
  )
}
