import { useState, useSyncExternalStore } from 'react'
import { useSelector } from 'react-redux'
import Icon from '../Icon/Icon'
import { getActionLog, subscribeToActionLog } from '../../redux/middleware/actionLogger'
import './StateInspector.css'

// Splits a JSON string into tokens so keys, strings, numbers… can be colored.
const TOKEN_REGEX = /("(?:\\.|[^"\\])*"(?:\s*:)?|-?\d+(?:\.\d+)?|\btrue\b|\bfalse\b|\bnull\b)/g

function tokenType(token) {
  if (token.startsWith('"')) return token.trimEnd().endsWith(':') ? 'key' : 'string'
  if (token === 'true' || token === 'false') return 'boolean'
  if (token === 'null') return 'null'
  return 'number'
}

function Json({ value, compact = false }) {
  const text = JSON.stringify(value, null, compact ? 0 : 2) ?? 'undefined'
  return (
    <code className="json">
      {text.split(TOKEN_REGEX).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={`json__${tokenType(part)}`}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </code>
  )
}

/**
 * Developer panel that displays the live Redux state and the last dispatched actions.
 * Handy to demonstrate how each user event flows through actions and reducers.
 */
export default function StateInspector() {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('state')

  const products = useSelector((state) => state.products)
  const cart = useSelector((state) => state.cart)
  const favorites = useSelector((state) => state.favorites)
  const filters = useSelector((state) => state.filters)
  const ui = useSelector((state) => state.ui)
  const actions = useSyncExternalStore(subscribeToActionLog, getActionLog)

  const state = {
    products: { items: `[${products.items.length} books]` },
    cart,
    favorites,
    filters,
    ui,
  }

  return (
    <div className={`inspector ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="inspector__panel" aria-label="Redux state inspector">
          <header className="inspector__header">
            <div className="inspector__tabs" role="tablist">
              {['state', 'actions'].map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={tab === name}
                  className={tab === name ? 'is-active' : ''}
                  onClick={() => setTab(name)}
                >
                  {name === 'state' ? 'Store state' : `Actions (${actions.length})`}
                </button>
              ))}
            </div>
            <span className="inspector__live">
              <span /> live
            </span>
          </header>

          <div className="inspector__body">
            {tab === 'state' ? (
              <pre>
                <Json value={state} />
              </pre>
            ) : actions.length === 0 ? (
              <p className="inspector__empty">Interact with the store — dispatched actions will appear here.</p>
            ) : (
              <ol className="inspector__actions">
                {actions.map((action) => (
                  <li key={action.id}>
                    <div className="inspector__action-head">
                      <span className={`inspector__type inspector__type--${action.type.split('/')[0]}`}>
                        {action.type}
                      </span>
                      <time>{action.time}</time>
                    </div>
                    {action.payload !== undefined && (
                      <pre>
                        <Json value={action.payload} compact />
                      </pre>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        className="inspector__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <Icon name={isOpen ? 'close' : 'code'} size={16} />
        Redux
      </button>
    </div>
  )
}
