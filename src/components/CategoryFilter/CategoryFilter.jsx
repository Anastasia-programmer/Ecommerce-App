import { useDispatch, useSelector } from 'react-redux'
import { setCategory } from '../../redux/actions/filterActions'
import { selectCategoryCounts, selectFilters } from '../../redux/selectors'
import { CATEGORIES } from '../../data/products'
import './CategoryFilter.css'

/** Category chips — reads and updates `filters.category` in the store. */
export default function CategoryFilter() {
  const dispatch = useDispatch()
  const { category: activeCategory } = useSelector(selectFilters)
  const counts = useSelector(selectCategoryCounts)

  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      {['All', ...CATEGORIES].map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          className={`chip ${activeCategory === category ? 'is-active' : ''}`}
          onClick={() => dispatch(setCategory(category))}
        >
          {category}
          <span className="chip__count">{counts[category] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}
