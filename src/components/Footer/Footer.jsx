import Logo from '../Logo/Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo size={34} />
          <p>
            An independent online bookshop for Algerian and world literature. Read widely, read
            freely.
          </p>
        </div>
        <p className="footer__credit">
          Built with React &amp; Redux · TP2 WAMD — ENSTA, 2026
        </p>
      </div>
    </footer>
  )
}
