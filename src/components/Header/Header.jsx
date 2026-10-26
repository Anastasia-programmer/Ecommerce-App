import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from '../Icon/Icon'
import Logo from '../Logo/Logo'
import { setSearchQuery } from '../../redux/actions/filterActions'
import { openCart, toggleTheme } from '../../redux/actions/uiActions'
import { selectCartCount, selectFavoritesCount, selectFilters, selectTheme } from '../../redux/selectors'
import './Header.css'

const NAV_ITEMS = [
  { id: 'shop', label: 'Shop', icon: 'book' },
  { id: 'favorites', label: 'Favorites', icon: 'heart' },
]

/**
 * Sticky header.
 * Props: currentPage + onNavigate (simple navigation handled by <App />).
 * Global state: search query, theme, cart and favorites counters.
 */
export default function Header({ currentPage, onNavigate }) {
  const dispatch = useDispatch()
  const { query } = useSelector(selectFilters)
  const theme = useSelector(selectTheme)
  const cartCount = useSelector(selectCartCount)
  const favoritesCount = useSelector(selectFavoritesCount)

  // Local UI state: add a shadow once the page is scrolled.
  const [isScrolled, setIsScrolled] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Press "/" anywhere to jump to the search field.
  useEffect(() => {
    const onKeyDown = (event) => {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value))
    if (currentPage !== 'shop') onNavigate('shop')
  }

  return (
    <header className={`header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container header__inner">
        <button type="button" className="header__logo" onClick={() => onNavigate('shop')} aria-label="Maktaba — home">
          <Logo />
        </button>

        <nav className="header__nav" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`header__nav-link ${currentPage === item.id ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size={18} />
              <span className="header__nav-label">{item.label}</span>
              {item.id === 'favorites' && favoritesCount > 0 && (
                <span className="header__nav-count">{favoritesCount}</span>
              )}
            </button>
          ))}
        </nav>

        <label className="header__search">
          <Icon name="search" size={18} />
          <span className="visually-hidden">Search books</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={handleSearch}
            placeholder="Search the shelf…"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="header__search-clear"
              onClick={() => dispatch(setSearchQuery(''))}
              aria-label="Clear search"
            >
              <Icon name="close" size={14} />
            </button>
          ) : (
            <kbd className="header__kbd">/</kbd>
          )}
        </label>

        <div className="header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>

          <button type="button" className="header__cart" onClick={() => dispatch(openCart())}>
            <Icon name="bag" />
            <span className="header__cart-label">Basket</span>
            <span key={cartCount} className={`header__cart-count ${cartCount ? 'has-items' : ''}`}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
