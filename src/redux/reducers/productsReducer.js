import products from '../../data/products'

/**
 * The catalog is read-only in this lab, so this reducer only provides
 * the initial state. Fetching products from an API would add actions here.
 */
const initialState = {
  items: products,
}

export default function productsReducer(state = initialState) {
  return state
}
