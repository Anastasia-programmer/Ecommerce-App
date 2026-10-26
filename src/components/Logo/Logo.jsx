import './Logo.css'

/** Store logo: a Moorish arch framing an open book. */
export default function Logo({ size = 40 }) {
  return (
    <span className="logo">
      <svg className="logo__mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="var(--primary)" />
        <path d="M11 33V19a9 9 0 0 1 18 0v14" fill="none" stroke="var(--on-primary)" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M14 27.5c2.2-.9 4.2-.6 6 .9 1.8-1.5 3.8-1.8 6-.9M14 23.5c2.2-.9 4.2-.6 6 .9 1.8-1.5 3.8-1.8 6-.9"
          fill="none"
          stroke="var(--on-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="15.5" r="1.8" fill="var(--gold)" />
      </svg>
      <span className="logo__text">
        <span className="logo__name">Maktaba</span>
        <span className="logo__arabic" lang="ar">
          مكتبة
        </span>
      </span>
    </span>
  )
}
