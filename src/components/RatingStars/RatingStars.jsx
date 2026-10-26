import Icon from '../Icon/Icon'
import './RatingStars.css'

/** Displays a 0–5 rating with partially filled stars. */
export default function RatingStars({ rating, reviews, size = 14 }) {
  return (
    <div className="rating" aria-label={`Rated ${rating} out of 5`}>
      <span className="rating__stars" style={{ '--fill': `${(rating / 5) * 100}%` }}>
        <span className="rating__row rating__row--empty">
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" size={size} filled strokeWidth={0} />
          ))}
        </span>
        <span className="rating__row rating__row--full">
          {[0, 1, 2, 3, 4].map((i) => (
            <Icon key={i} name="star" size={size} filled strokeWidth={0} />
          ))}
        </span>
      </span>
      <span className="rating__value">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="rating__count">({reviews})</span>}
    </div>
  )
}
