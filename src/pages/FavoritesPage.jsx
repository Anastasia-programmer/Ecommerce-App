import { useSelector } from 'react-redux'
import EmptyState from '../components/EmptyState/EmptyState'
import Icon from '../components/Icon/Icon'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import { selectFavoriteProducts } from '../redux/selectors'
import './Pages.css'

/** Books saved with the heart button (favorites state from the store). */
export default function FavoritesPage({ onOpenDetails, onNavigate }) {
  const favorites = useSelector(selectFavoriteProducts)

  return (
    <section className="container page-section page-section--top">
      <button type="button" className="link-btn link-btn--back" onClick={() => onNavigate('shop')}>
        <Icon name="arrowLeft" size={16} />
        Back to the shop
      </button>

      <div className="section-head">
        <div>
          <p className="section-head__eyebrow">Your shelf</p>
          <h1 className="section-head__title">Favorites</h1>
          <p className="section-head__count">
            {favorites.length} saved {favorites.length === 1 ? 'book' : 'books'}
          </p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <ProductGrid products={favorites} onOpenDetails={onOpenDetails} />
      ) : (
        <EmptyState
          icon="heart"
          title="No favorites yet"
          action={
            <button type="button" className="btn btn--primary" onClick={() => onNavigate('shop')}>
              Explore the catalog
              <Icon name="arrowRight" size={18} />
            </button>
          }
        >
          Tap the heart on any book to keep it here for later.
        </EmptyState>
      )}
    </section>
  )
}
