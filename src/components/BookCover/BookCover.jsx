import CoverArt from './CoverArt'
import './BookCover.css'

// Longer titles get a smaller font so they always fit on the cover.
function titleScale(title) {
  if (title.length <= 10) return 1
  if (title.length <= 16) return 0.86
  if (title.length <= 24) return 0.74
  return 0.64
}

/**
 * Reusable generated book cover.
 * Used in the product cards, the product details, the cart and the hero.
 */
export default function BookCover({ book, className = '' }) {
  const { bg, fg, accent, pattern, layout = 'bottom', rtl = false } = book.cover
  const title = book.coverTitle ?? book.title
  const author = book.coverAuthor ?? book.author

  return (
    <div
      className={`book-cover book-cover--${layout} ${rtl ? 'book-cover--rtl' : ''} ${className}`}
      style={{
        '--cover-bg': bg,
        '--cover-fg': fg,
        '--cover-accent': accent,
        '--title-scale': titleScale(title),
      }}
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author}`}
    >
      <div className="book-cover__art-wrap">
        <CoverArt pattern={pattern} fg={fg} accent={accent} bg={bg} />
      </div>
      <div className="book-cover__text" dir={rtl ? 'rtl' : undefined}>
        <span className="book-cover__author">{author}</span>
        <span className="book-cover__title">{title}</span>
      </div>
    </div>
  )
}
