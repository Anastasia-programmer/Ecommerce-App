import { useId } from 'react'

/**
 * Geometric SVG motifs used on the generated book covers.
 * Each motif is drawn in a 100×100 box with three colors: fg, accent and bg.
 * Inspired by zellige tiles, Moorish arches and Berber (Kabyle) patterns.
 */

// 8-point star (the shape of two overlapping squares) as a polygon.
function starPoints(cx, cy, radius) {
  const inner = radius * 0.7654
  return Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? radius : inner
    const angle = (Math.PI / 8) * i - Math.PI / 2
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

// Horseshoe arch resting on the bottom edge.
const ARCH = 'M20 100 L20 60 A36 36 0 1 1 80 60 L80 100 Z'

const STARS = [
  [12, 14, 1.1], [24, 30, 0.7], [82, 12, 1], [90, 36, 0.6], [70, 22, 0.8], [14, 72, 0.7],
  [28, 88, 1], [86, 80, 0.8], [93, 60, 1.1], [7, 46, 0.6], [60, 7, 0.7], [40, 16, 1],
  [76, 92, 0.6], [52, 94, 0.9],
]

function Stars({ fill }) {
  return STARS.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />)
}

// Bauhaus-like shapes inside a square cell (x, y, size).
const shapes = {
  circle: (x, y, s) => `M${x} ${y + s / 2} a${s / 2} ${s / 2} 0 1 0 ${s} 0 a${s / 2} ${s / 2} 0 1 0 ${-s} 0`,
  quarterTL: (x, y, s) => `M${x} ${y} L${x + s} ${y} A${s} ${s} 0 0 1 ${x} ${y + s} Z`,
  quarterBR: (x, y, s) => `M${x + s} ${y + s} L${x} ${y + s} A${s} ${s} 0 0 1 ${x + s} ${y} Z`,
  quarterTR: (x, y, s) => `M${x + s} ${y} L${x + s} ${y + s} A${s} ${s} 0 0 1 ${x} ${y} Z`,
  quarterBL: (x, y, s) => `M${x} ${y + s} L${x} ${y} A${s} ${s} 0 0 1 ${x + s} ${y + s} Z`,
  domeUp: (x, y, s) => `M${x} ${y + s * 0.75} A${s / 2} ${s / 2} 0 0 1 ${x + s} ${y + s * 0.75} Z`,
  domeRight: (x, y, s) => `M${x + s * 0.25} ${y} A${s / 2} ${s / 2} 0 0 1 ${x + s * 0.25} ${y + s} Z`,
  domeDown: (x, y, s) => `M${x + s} ${y + s * 0.25} A${s / 2} ${s / 2} 0 0 1 ${x} ${y + s * 0.25} Z`,
}

const BAUHAUS_GRID = [
  ['quarterBR', 'accent'], ['circle', 'fg'], ['domeUp', 'fg'],
  ['domeRight', 'fg'], ['quarterTL', 'accent'], ['circle', 'outline'],
  ['circle', 'accent'], ['domeDown', 'fg'], ['quarterBL', 'fg'],
]

export default function CoverArt({ pattern, fg, accent, bg }) {
  const uid = useId().replace(/:/g, '')

  const motifs = {
    star: (
      <>
        <Stars fill={fg} />
        <polygon points={starPoints(50, 52, 36)} fill="none" stroke={fg} strokeWidth="1.2" />
        <polygon points={starPoints(50, 52, 27)} fill={accent} />
        <polygon points={starPoints(50, 52, 15)} fill={bg} />
        <circle cx="50" cy="52" r="4.5" fill={fg} />
      </>
    ),

    arch: (
      <>
        <path d={ARCH} fill="none" stroke={fg} strokeWidth="1.2" />
        <path d={ARCH} fill={accent} transform="translate(50 100) scale(0.78) translate(-50 -100)" />
        <path d={ARCH} fill={bg} transform="translate(50 100) scale(0.56) translate(-50 -100)" />
        <circle cx="50" cy="62" r="5" fill={fg} />
        <path d="M14 100 H86" stroke={fg} strokeWidth="1.2" />
      </>
    ),

    sun: (
      <>
        <circle cx="50" cy="54" r="31" fill={accent} />
        {[
          [60, 1.6],
          [66, 2.4],
          [72, 3.2],
          [78, 4],
        ].map(([y, h]) => (
          <rect key={y} x="0" y={y} width="100" height={h} fill={bg} />
        ))}
        <path d="M0 86 H100" stroke={fg} strokeWidth="1.2" />
        <path d="M30 91 H70 M40 95 H60" stroke={fg} strokeWidth="0.9" opacity="0.6" />
      </>
    ),

    dunes: (
      <>
        <circle cx="70" cy="30" r="12" fill={accent} />
        <path d="M0 60 C25 46 45 48 62 58 S90 64 100 54 V100 H0 Z" fill={fg} opacity="0.22" />
        <path d="M0 72 C20 64 40 62 58 70 S85 82 100 70 V100 H0 Z" fill={fg} opacity="0.45" />
        <path d="M0 86 C25 78 50 80 70 86 S92 90 100 84 V100 H0 Z" fill={fg} opacity="0.85" />
      </>
    ),

    zellige: (
      <>
        <defs>
          <pattern id={`z-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points={starPoints(10, 10, 7.5)} fill="none" stroke={fg} strokeWidth="0.8" opacity="0.75" />
            {[
              [0, 0],
              [20, 0],
              [0, 20],
              [20, 20],
            ].map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x - 2} y={y - 2} width="4" height="4" fill={accent} transform={`rotate(45 ${x} ${y})`} />
            ))}
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#z-${uid})`} />
        <circle cx="50" cy="50" r="25" fill={bg} stroke={accent} strokeWidth="1.5" />
        <polygon points={starPoints(50, 50, 18)} fill={accent} />
        <polygon points={starPoints(50, 50, 9)} fill={bg} />
      </>
    ),

    kabyle: (
      <>
        <polyline
          points={Array.from({ length: 17 }, (_, i) => `${i * 6.25},${i % 2 ? 12 : 20}`).join(' ')}
          fill="none"
          stroke={fg}
          strokeWidth="1.4"
        />
        {[12.5, 37.5, 62.5, 87.5].map((x) => (
          <g key={x}>
            <polygon points={`${x},30 ${x + 11},42 ${x},54 ${x - 11},42`} fill={accent} />
            <polygon points={`${x},36 ${x + 5.5},42 ${x},48 ${x - 5.5},42`} fill={bg} />
            <circle cx={x} cy="42" r="1.6" fill={fg} />
          </g>
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <polygon key={i} points={`${i * 12.5},74 ${i * 12.5 + 6.25},62 ${i * 12.5 + 12.5},74`} fill={fg} />
        ))}
        <polyline
          points={Array.from({ length: 17 }, (_, i) => `${i * 6.25},${i % 2 ? 80 : 86}`).join(' ')}
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={5 + i * 10} cy="94" r="1.4" fill={fg} />
        ))}
      </>
    ),

    waves: (
      <>
        <circle cx="74" cy="17" r="9" fill={accent} />
        {[34, 43, 52, 61, 70, 79, 88].map((y, i) => (
          <path
            key={y}
            d={`M-10 ${y} Q0 ${y - 5} 10 ${y} T30 ${y} T50 ${y} T70 ${y} T90 ${y} T110 ${y}`}
            fill="none"
            stroke={i % 3 === 1 ? accent : fg}
            strokeWidth="1.5"
          />
        ))}
      </>
    ),

    rings: (
      <>
        {[8, 14, 20, 26, 32, 38, 44].map((r, i) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={fg} strokeWidth="0.8" opacity={1 - i * 0.1} />
        ))}
        <circle cx="50" cy="50" r="26" fill="none" stroke={accent} strokeWidth="2.2" />
        <circle cx="50" cy="50" r="9" fill={accent} />
      </>
    ),

    bauhaus: (
      <>
        {BAUHAUS_GRID.map(([shape, color], i) => {
          const size = 24
          const x = 13 + (i % 3) * (size + 1)
          const y = 13 + Math.floor(i / 3) * (size + 1)
          const isOutline = color === 'outline'
          return (
            <path
              key={i}
              d={shapes[shape](x + 1.5, y + 1.5, size - 3)}
              fill={isOutline ? 'none' : color === 'accent' ? accent : fg}
              stroke={isOutline ? fg : 'none'}
              strokeWidth="1.2"
            />
          )
        })}
      </>
    ),

    orbit: (
      <>
        <Stars fill={fg} />
        <circle cx="50" cy="52" r="38" fill="none" stroke={fg} strokeWidth="0.7" strokeDasharray="1.5 2.5" opacity="0.6" />
        <circle cx="50" cy="52" r="15" fill={accent} />
        <ellipse cx="50" cy="52" rx="29" ry="7" fill="none" stroke={fg} strokeWidth="1.5" transform="rotate(-18 50 52)" />
        <circle cx="83" cy="33" r="3.2" fill={fg} />
      </>
    ),
  }

  return (
    <svg
      className="book-cover__art"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {motifs[pattern] ?? motifs.rings}
    </svg>
  )
}
