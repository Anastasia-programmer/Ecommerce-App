import { useSelector } from 'react-redux'
import BookCover from '../BookCover/BookCover'
import Icon from '../Icon/Icon'
import { selectCategoryCounts, selectProducts } from '../../redux/selectors'
import { formatPrice } from '../../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../../data/products'
import './Hero.css'

const FEATURED_IDS = ['l-etranger', 'nedjma', 'memory-in-the-flesh']

export default function Hero({ onBrowse, onOpenDetails }) {
  const products = useSelector(selectProducts)
  const categoryCounts = useSelector(selectCategoryCounts)
  const featured = FEATURED_IDS.map((id) => products.find((product) => product.id === id)).filter(Boolean)
  const authors = new Set(products.map((product) => product.author)).size

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <Icon name="sparkle" size={16} />
            Algerian &amp; world literature
          </p>
          <h1 className="hero__title">
            Read Algeria.
            <br />
            <em>Read the world.</em>
          </h1>
          <p className="hero__lead">
            A hand-picked shelf of novels, poetry, history and science — from Kateb Yacine to Carl Sagan.
            Browse the catalog, save your favorites and fill your basket.
          </p>

          <div className="hero__cta">
            <button type="button" className="btn btn--primary" onClick={onBrowse}>
              Browse the shelf
              <Icon name="arrowRight" size={18} />
            </button>
            <span className="hero__shipping">
              <Icon name="truck" size={18} />
              Free delivery from {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </span>
          </div>

          <dl className="hero__stats">
            <div>
              <dt>Titles</dt>
              <dd>{products.length}</dd>
            </div>
            <div>
              <dt>Authors</dt>
              <dd>{authors}</dd>
            </div>
            <div>
              <dt>Categories</dt>
              <dd>{Object.keys(categoryCounts).length - 1}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual" aria-label="Featured books">
          <div className="hero__arch" aria-hidden="true" />
          {featured.map((book, index) => (
            <button
              key={book.id}
              type="button"
              className={`hero__book hero__book--${index}`}
              onClick={() => onOpenDetails(book.id)}
              aria-label={`View details of ${book.title}`}
            >
              <BookCover book={book} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
