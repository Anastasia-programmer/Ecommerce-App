import Icon from '../Icon/Icon'
import './EmptyState.css'

/** Friendly placeholder for empty lists (no results, empty cart, no favorites). */
export default function EmptyState({ icon = 'book', title, children, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon name={icon} size={28} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {children && <p className="empty-state__text">{children}</p>}
      {action}
    </div>
  )
}
