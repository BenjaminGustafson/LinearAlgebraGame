import type { MatrixEntry } from '../App'

interface MatrixStackProps {
  stack: MatrixEntry[]
  onUndo: () => void
  onReset: () => void
}

function MatrixCard({ entry }: { entry: MatrixEntry }) {
  const fmt = (n: number) => {
    const s = parseFloat(n.toFixed(2)).toString()
    return s.length > 5 ? s.slice(0, 5) : s
  }

  return (
    <div
      style={{
        background: '#131317',
        border: '1px solid #2a2a30',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#5aff8a'
        el.style.boxShadow = '0 0 0 2px rgba(90,255,138,0.07)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#2a2a30'
        el.style.boxShadow = 'none'
      }}
    >
      <div style={{
        fontSize: '9px',
        letterSpacing: '0.18em',
        color: '#5aff8a',
        textTransform: 'uppercase',
        fontFamily: '"IBM Plex Mono", monospace',
        marginBottom: '2px',
      }}>{entry.label}</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
      }}>
        {entry.values.map((v, i) => (
          <div key={i} style={{
            fontSize: '9px',
            color: v === 0 ? '#383840' : '#a8d8a0',
            fontFamily: '"IBM Plex Mono", monospace',
            textAlign: 'center',
            lineHeight: '14px',
          }}>
            {fmt(v)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MatrixStack({ stack, onUndo, onReset }: MatrixStackProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: '220px',
      right: 0,
      height: '90px',
      background: 'rgba(10, 10, 13, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e1e24',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '16px',
      fontFamily: '"IBM Plex Mono", monospace',
    }}>

      <div style={{
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: '#444',
        textTransform: 'uppercase',
        flexShrink: 0,
        paddingRight: '12px',
        borderRight: '1px solid #222',
      }}>Stack</div>

      {/* Cards or empty state */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        flex: 1,
        paddingBottom: '2px',
        scrollbarWidth: 'none',
        alignItems: 'center',
      }}>
        {stack.length === 0 ? (
          <div style={{
            fontSize: '10px',
            color: '#333',
            letterSpacing: '0.1em',
            fontStyle: 'italic',
          }}>no matrices applied</div>
        ) : (
          stack.map((entry, i) => <MatrixCard key={i} entry={entry} />)
        )}
      </div>

      <div style={{ width: '1px', height: '40px', background: '#222', flexShrink: 0 }} />

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {([['Undo', onUndo, '#5aff8a'], ['Reset', onReset, '#ff6b6b']] as const).map(([label, handler, accent]) => (
          <button
            key={label}
            onClick={handler}
            style={{
              height: '30px',
              padding: '0 14px',
              background: 'transparent',
              border: '1px solid #2e2e36',
              borderRadius: '3px',
              color: '#666',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: '"IBM Plex Mono", monospace',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = accent
              el.style.color = accent
              el.style.background = `${accent}0d`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = '#2e2e36'
              el.style.color = '#666'
              el.style.background = 'transparent'
            }}
          >
            {label === 'Undo' ? '↩ Undo' : '⟳ Reset'}
          </button>
        ))}
      </div>
    </div>
  )
}
