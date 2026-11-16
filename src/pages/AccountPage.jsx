import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from '../components/Icon/Icon'
import { login, logout, register } from '../redux/actions/authActions'
import { showToast } from '../redux/actions/uiActions'
import { selectUser } from '../redux/selectors'
import './Pages.css'

const EMPTY_FORM = { name: '', email: '', password: '' }

/**
 * Sign in / create an account with the backend (POST /api/auth/login and /register).
 * Local state: the form fields, the API error message and the "submitting" flag.
 * Global state: the logged-in user and JWT (auth reducer).
 */
export default function AccountPage({ onNavigate }) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isRegister = mode === 'register'
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const loggedUser = isRegister
        ? await dispatch(register(form.name, form.email, form.password))
        : await dispatch(login(form.email, form.password))
      dispatch(showToast(`Welcome, ${loggedUser.name}!`))
      setForm(EMPTY_FORM)
      onNavigate('manage')
    } catch (err) {
      // The API message: "Invalid email or password", "Email already registered"…
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(showToast('You are signed out'))
  }

  // Already logged in: show the account and a sign-out button
  if (user) {
    return (
      <section className="container page-section page-section--top">
        <div className="auth-card">
          <div className="auth-card__avatar">
            <Icon name="user" size={28} />
          </div>
          <h1 className="auth-card__title">{user.name}</h1>
          <p className="auth-card__lead">Signed in as {user.email}</p>
          <div className="auth-card__actions">
            <button type="button" className="btn btn--primary" onClick={() => onNavigate('manage')}>
              <Icon name="edit" size={16} />
              Manage the books
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              <Icon name="logout" size={16} />
              Sign out
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container page-section page-section--top">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!isRegister} onClick={() => switchMode('login')}>
            Sign in
          </button>
          <button type="button" role="tab" aria-selected={isRegister} onClick={() => switchMode('register')}>
            Create an account
          </button>
        </div>

        <h1 className="auth-card__title">{isRegister ? 'Join Maktaba' : 'Welcome back'}</h1>
        <p className="auth-card__lead">
          {isRegister ? 'Create an account to manage the catalog.' : 'Sign in to add, edit and delete books.'}
        </p>

        {isRegister && (
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={update('name')} autoComplete="name" required />
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={isRegister ? 6 : undefined}
            required
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait…' : isRegister ? 'Create my account' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
