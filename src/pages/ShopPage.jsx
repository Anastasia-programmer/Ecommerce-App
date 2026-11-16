import { useDispatch, useSelector } from 'react-redux'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter'
import EmptyState from '../components/EmptyState/EmptyState'
import Hero from '../components/Hero/Hero'
import Icon from '../components/Icon/Icon'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import SortSelect from '../components/SortSelect/SortSelect'
import { resetFilters, setSearchQuery } from '../redux/actions/filterActions'
import { fetchProducts } from '../redux/actions/productActions'
import { selectFilters, selectProductsError, selectProductsStatus, selectVisibleProducts } from '../redux/selectors'
import './Pages.css'

/** Home page: hero + filterable, sortable catalog. */
export default function ShopPage({ onOpenDetails }) {
  const dispatch = useDispatch()
  const products = useSelector(selectVisibleProducts)
  const status = useSelector(selectProductsStatus)
  const error = useSelector(selectProductsError)
  const { query, category } = useSelector(selectFilters)
  const isSearching = query.trim() !== ''

  // The catalog comes from the API: show its loading and error states.
  let content
  if (status === 'idle' || status === 'loading') {
    content = <EmptyState icon="book" title="Loading the books…">Fetching the catalog from the API.</EmptyState>
  } else if (status === 'failed') {
    content = (
      <EmptyState
        icon="shield"
        title="Could not load the books"
        action={
          <button type="button" className="btn btn--primary" onClick={() => dispatch(fetchProducts())}>
            <Icon name="undo" size={16} />
            Try again
          </button>
        }
      >
        {error} Start it with “npm run api”, then try again.
      </EmptyState>
    )
  } else if (products.length > 0) {
    content = <ProductGrid products={products} onOpenDetails={onOpenDetails} />
  } else {
    content = (
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
    )
  }

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

        {content}
      </section>
    </>
  )
}
