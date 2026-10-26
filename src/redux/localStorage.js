/**
 * Local storage persistence (optional feature).
 * Only the cart, the favorites and the theme are saved — filters and
 * open panels are temporary and start fresh on each visit.
 */
const STORAGE_KEY = 'maktaba:state:v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be full or disabled (private mode): the app still works.
  }
}
