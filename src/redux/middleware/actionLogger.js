/**
 * A small Redux middleware that records the last dispatched actions,
 * so the in-app <StateInspector /> can show them live.
 * (The Redux DevTools browser extension offers the same — and more.)
 */
const MAX_ENTRIES = 12
const listeners = new Set()
let entries = []
let counter = 0

export const actionLogger = () => (next) => (action) => {
  const result = next(action)

  counter += 1
  entries = [
    {
      id: counter,
      type: action.type,
      // A long list (e.g. the books from the API) is summarized to keep the panel readable
      payload: Array.isArray(action.payload) ? `[${action.payload.length} items]` : action.payload,
      time: new Date().toLocaleTimeString(),
    },
    ...entries,
  ].slice(0, MAX_ENTRIES)
  listeners.forEach((listener) => listener())

  return result
}

// Subscription API used with React's useSyncExternalStore.
export const subscribeToActionLog = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getActionLog = () => entries
