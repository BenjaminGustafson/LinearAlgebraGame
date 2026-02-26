import { useState } from 'react'
import type { Matrix3x3 } from '../App'

interface MatrixPanelProps {
  onAdd: (values: Matrix3x3) => void
}

const IDENTITY: Matrix3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]

export default function MatrixPanel({ onAdd }: MatrixPanelProps) {
  const [values, setValues] = useState<string[]>(IDENTITY.map(String))

  const handleChange = (index: number, val: string) => {
    const next = [...values]
    next[index] = val
    setValues(next)
  }

  const handleAdd = () => {
    const nums = values.map(v => parseFloat(v) || 0) as Matrix3x3
    onAdd(nums)
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      height: '100vh',
      width: '220px',
      background: '#0d0d0f',
      borderRight: '1px solid #2a2a2e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '28px',
      zIndex: 10,
      fontFamily: '"IBM Plex Mono", "Courier New", monospace',
    }}>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: '#555',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>Transform</div>
        <div style={{
          fontSize: '13px',
          color: '#e0e0e0',
          letterSpacing: '0.05em',
        }}>Matrix</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="10" height="108" viewBox="0 0 10 108" fill="none">
          <path d="M8 2 H3 V106 H8" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 48px)',
          gridTemplateRows: 'repeat(3, 32px)',
          gap: '6px',
        }}>
          {values.map((val, i) => (
            <input
              key={i}
              type="number"
              value={val}
              onChange={e => handleChange(i, e.target.value)}
              placeholder="0"
              style={{
                width: '48px',
                height: '32px',
                background: '#16161a',
                border: '1px solid #2e2e34',
                borderRadius: '3px',
                color: '#c8f0b0',
                fontSize: '13px',
                textAlign: 'center',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              } as React.CSSProperties}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#5aff8a'
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(90,255,138,0.08)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#2e2e34'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          ))}
        </div>

        <svg width="10" height="108" viewBox="0 0 10 108" fill="none">
          <path d="M2 2 H7 V106 H2" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <button
        onClick={handleAdd}
        style={{
          width: '138px',
          height: '34px',
          background: 'transparent',
          border: '1px solid #3a3a40',
          borderRadius: '3px',
          color: '#888',
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#5aff8a'
          e.currentTarget.style.color = '#5aff8a'
          e.currentTarget.style.background = 'rgba(90,255,138,0.04)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#3a3a40'
          e.currentTarget.style.color = '#888'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        + Add
      </button>
    </div>
  )
}
