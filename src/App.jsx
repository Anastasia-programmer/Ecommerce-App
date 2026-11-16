import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartDrawer from './components/CartDrawer/CartDrawer'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import ProductDetails from './components/ProductDetails/ProductDetails'
import StateInspector from './components/StateInspector/StateInspector'
import Toast from './components/Toast/Toast'
import AccountPage from './pages/AccountPage'
import FavoritesPage from './pages/FavoritesPage'
import ManagePage from './pages/ManagePage'
import ShopPage from './pages/ShopPage'
import { fetchProducts } from './redux/actions/productActions'
import { selectIsCartOpen, selectTheme } from './redux/selectors'

/**
 * Root component.
 * Local state (React): the current page and the product opened in the details dialog.
 * Global state (Redux): everything shared by several components — cart, favorites,
 * filters, theme, cart drawer, notifications.
 */
export default function App() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const isCartOpen = useSelector(selectIsCartOpen)

  const [page, setPage] = useState('shop')
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Load the catalog from the backend API once, when the app starts.
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

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
        {page === 'shop' && <ShopPage onOpenDetails={setSelectedProductId} />}
        {page === 'favorites' && <FavoritesPage onOpenDetails={setSelectedProductId} onNavigate={navigate} />}
        {page === 'account' && <AccountPage onNavigate={navigate} />}
        {page === 'manage' && <ManagePage onNavigate={navigate} />}
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
