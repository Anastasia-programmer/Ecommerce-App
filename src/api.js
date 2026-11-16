/**
 * Calls to the backend REST API (the server/ folder, TD-TP 3).
 * The URL can be changed with VITE_API_URL in a .env file at the project root.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// Cover used for books created without one (from the admin form or Postman)
const DEFAULT_COVER = { bg: '#1F3A5F', fg: '#F3E9D2', accent: '#E0A526', pattern: 'star', layout: 'bottom' }

/**
 * Converts a product from the API into the shape the React components use:
 * the API calls it `name`, the components were written with `title`.
 */
const toBook = (product) => ({
  ...product,
  title: product.name,
  year: product.year ?? new Date(product.createdAt).getFullYear(),
  cover: product.cover?.bg ? product.cover : DEFAULT_COVER,
})

/**
 * Sends one HTTP request to the API with fetch.
 * - `body` is sent as JSON, `token` as "Authorization: Bearer <token>".
 * - Errors are thrown as Error objects with the API message ({ "error": "..." })
 *   and the HTTP status, so the UI can display them.
 */
async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: body && JSON.stringify(body) })
  } catch {
    // fetch only throws when the server cannot be reached at all
    throw new Error(`Cannot reach the server at ${API_URL}. Is the API running?`)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error ?? `Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }
  return data
}

// ---- Products ----------------------------------------------------------------
export const getProducts = async () => (await request('/products')).map(toBook)

export const createProduct = async (product, token) =>
  toBook(await request('/products', { method: 'POST', body: product, token }))

export const updateProduct = async (id, changes, token) =>
  toBook(await request(`/products/${id}`, { method: 'PUT', body: changes, token }))

export const deleteProduct = (id, token) => request(`/products/${id}`, { method: 'DELETE', token })

// ---- Authentication ------------------------------------------------------------
export const register = (user) => request('/auth/register', { method: 'POST', body: user })

// → { token, user }
export const login = (credentials) => request('/auth/login', { method: 'POST', body: credentials })
