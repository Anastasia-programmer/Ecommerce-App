import { useDispatch, useSelector } from 'react-redux'
import Icon from '../Icon/Icon'
import { setSort } from '../../redux/actions/filterActions'
import { selectFilters } from '../../redux/selectors'
import './SortSelect.css'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Most recent' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Title: A → Z' },
]

/** Sorting control — reads and updates `filters.sort` in the store. */
export default function SortSelect() {
  const dispatch = useDispatch()
  const { sort } = useSelector(selectFilters)

  return (
    <label className="sort-select">
      <Icon name="sort" size={16} />
      <span className="visually-hidden">Sort books</span>
      <select value={sort} onChange={(event) => dispatch(setSort(event.target.value))}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
