import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CartDrawer from './components/CartDrawer/CartDrawer'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import ProductDetails from './components/ProductDetails/ProductDetails'
import StateInspector from './components/StateInspector/StateInspector'
import Toast from './components/Toast/Toast'
import FavoritesPage from './pages/FavoritesPage'
import ShopPage from './pages/ShopPage'
import { selectIsCartOpen, selectTheme } from './redux/selectors'

/**
 * Root component.
 * Local state (React): the current page and the product opened in the details dialog.
 * Global state (Redux): everything shared by several components — cart, favorites,
 * filters, theme, cart drawer, notifications.
 */
export default function App() {
  const theme = useSelector(selectTheme)
  const isCartOpen = useSelector(selectIsCartOpen)

  const [page, setPage] = useState('shop')
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Apply the theme stored in Redux to the whole document.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Prevent the page from scrolling behind the drawer / dialog.
  useEffect(() => {
    document.body.classList.toggle('is-locked', isCartOpen || selectedProductId !== null)
  }, [isCartOpen, selectedProductId])

  const navigate = useCallback((nextPage) => {
    setPage(nextPage)
    window.scrollTo({ top: 0 })
  }, [])

  const closeDetails = useCallback(() => setSelectedProductId(null), [])

  return (
    <>
      <Header currentPage={page} onNavigate={navigate} />

      <main>
        {page === 'shop' ? (
          <ShopPage onOpenDetails={setSelectedProductId} />
        ) : (
          <FavoritesPage onOpenDetails={setSelectedProductId} onNavigate={navigate} />
        )}
      </main>

      <Footer />

      <CartDrawer />
      {selectedProductId && (
        <ProductDetails key={selectedProductId} productId={selectedProductId} onClose={closeDetails} />
      )}
      <Toast />
      <StateInspector />
    </>
  )
}
