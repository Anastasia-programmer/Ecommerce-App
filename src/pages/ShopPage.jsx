import { useDispatch, useSelector } from 'react-redux'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter'
import EmptyState from '../components/EmptyState/EmptyState'
import Hero from '../components/Hero/Hero'
import Icon from '../components/Icon/Icon'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import SortSelect from '../components/SortSelect/SortSelect'
import { resetFilters, setSearchQuery } from '../redux/actions/filterActions'
import { selectFilters, selectVisibleProducts } from '../redux/selectors'
import './Pages.css'

/** Home page: hero + filterable, sortable catalog. */
export default function ShopPage({ onOpenDetails }) {
  const dispatch = useDispatch()
  const products = useSelector(selectVisibleProducts)
  const { query, category } = useSelector(selectFilters)
  const isSearching = query.trim() !== ''

  const scrollToCatalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      {!isSearching && <Hero onBrowse={scrollToCatalog} onOpenDetails={onOpenDetails} />}

      <section id="catalog" className="container page-section">
        <div className="section-head">
          <div>
            <p className="section-head__eyebrow">{isSearching ? 'Search results' : 'The catalog'}</p>
            <h2 className="section-head__title">
              {isSearching ? (
                <>
                  Results for <em>“{query.trim()}”</em>
                </>
              ) : category === 'All' ? (
                'Find your next read'
              ) : (
                category
              )}
            </h2>
            <p className="section-head__count">
              {products.length} {products.length === 1 ? 'book' : 'books'}
              {isSearching && (
                <button type="button" className="link-btn" onClick={() => dispatch(setSearchQuery(''))}>
                  Clear search
                </button>
              )}
            </p>
          </div>
          <SortSelect />
        </div>

        <div className="toolbar">
          <CategoryFilter />
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} onOpenDetails={onOpenDetails} />
        ) : (
          <EmptyState
            icon="search"
            title="No books found"
            action={
              <button type="button" className="btn btn--ghost" onClick={() => dispatch(resetFilters())}>
                <Icon name="undo" size={16} />
                Reset filters
              </button>
            }
          >
            Nothing matches your search in this category. Try another title, an author name, or reset the filters.
          </EmptyState>
        )}
      </section>
    </>
  )
}
