// ── Badge ──
const BADGE_COLORS = {
  pendiente:  { bg: 'rgba(212,143,10,.12)',  color: '#a06b00' },
  aceptado:   { bg: 'rgba(15,158,110,.12)',  color: '#0a7a55' },
  finalizado: { bg: 'rgba(107,63,160,.12)',  color: '#5a2d91' },
  rechazado:  { bg: 'rgba(217,48,37,.10)',   color: '#b52920' },
  admin:      { bg: 'rgba(10,27,78,.10)',    color: '#0A1B4E' },
  estudiante: { bg: 'rgba(15,158,110,.12)',  color: '#0a7a55' },
  active:     { bg: 'rgba(15,158,110,.12)',  color: '#0a7a55' },
  inactive:   { bg: 'rgba(217,48,37,.10)',   color: '#b52920' },
};

export function Badge({ type, children }) {
  const s = BADGE_COLORS[type] || { bg: 'var(--bg3)', color: 'var(--text2)' };
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600,
      padding: '3px 9px', borderRadius: 20,
      background: s.bg, color: s.color
    }}>{children}</span>
  );
}

// ── Tag ──
const TAG_COLORS = {
  blue:  { bg: 'rgba(10,27,78,.08)',   color: '#0A1B4E' },
  green: { bg: 'rgba(15,158,110,.10)', color: '#0a7a55' },
  amber: { bg: 'rgba(212,143,10,.10)', color: '#a06b00' },
  gray:  { bg: 'rgba(10,27,78,.06)',   color: 'var(--text2)' },
};
export function Tag({ color = 'gray', children }) {
  const s = TAG_COLORS[color] || TAG_COLORS.gray;
  return (
    <span style={{
      fontSize: 11, padding: '3px 8px', borderRadius: 4,
      fontWeight: 500, background: s.bg, color: s.color
    }}>{children}</span>
  );
}

// ── Button ──
export function Btn({ variant = 'outline', onClick, disabled, children, style }) {
  const variants = {
    accent:  { background: 'var(--accent)',  color: '#fff', border: '1px solid var(--accent)' },
    outline: { background: 'none', color: 'var(--text2)', border: '1px solid var(--border2)' },
    danger:  { background: 'none', color: '#b52920', border: '1px solid rgba(217,48,37,.30)' },
    green:   { background: 'rgba(15,158,110,.10)', color: 'var(--green)', border: '1px solid rgba(15,158,110,.30)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
      padding: '7px 14px', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      opacity: disabled ? .45 : 1, transition: '.15s',
      ...variants[variant], ...style
    }}>{children}</button>
  );
}

// ── StatCard ──
const STAT_COLORS = { blue:'var(--accent)', green:'var(--green)', amber:'var(--amber)', purple:'var(--purple)' };
export function StatCard({ label, value, sub, color = 'blue' }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: 20,
      boxShadow: '0 1px 4px rgba(10,27,78,.06)'
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: STAT_COLORS[color], lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{sub}</div>
    </div>
  );
}

// ── PageHeader ──
export function PageHeader({ title, subtitle, titleStyle }) {
  return (
    <div className="fade-up" style={{ marginBottom: 28 }}>
      <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, fontWeight: 400, letterSpacing: -.3, marginBottom: 4, color: 'var(--text)', ...titleStyle }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: 'var(--text2)' }}>{subtitle}</p>}
    </div>
  );
}

// ── TableWrap ──
export function TableWrap({ children }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 28, boxShadow: '0 1px 4px rgba(10,27,78,.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  );
}
export function Th({ children, style }) {
  return <th style={{ background: 'var(--bg3)', padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text3)', letterSpacing: .6, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', ...style }}>{children}</th>;
}
export function Td({ children, style }) {
  return <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text2)', verticalAlign: 'middle', ...style }}>{children}</td>;
}

// ── Modal ──
export function Modal({ open, onClose, title, children, footer, width = 500 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(10,27,78,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 16, width, maxWidth: '94vw', maxHeight: '88vh',
        overflowY: 'auto', boxShadow: '0 20px 60px rgba(10,27,78,.18)',
        animation: 'fadeUp .25s ease'
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 16px', borderBottom:'1px solid var(--border)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:22, cursor:'pointer', lineHeight:1, padding:'2px 6px' }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
        {footer && <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'16px 24px', borderTop:'1px solid var(--border)' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ── Field ──
export function Field({ label, children }) {
  const reactId = useId();
  const child = isValidElement(children) ? children : null;
  const fieldId = child?.props?.id || child?.props?.name || `field-${reactId.replace(/:/g, '')}`;
  const fieldName = child?.props?.name || fieldId;

  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={fieldId} style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--text2)', marginBottom:7 }}>{label}</label>
      {child ? cloneElement(child, { id: fieldId, name: fieldName }) : children}
    </div>
  );
}
const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border2)',
  borderRadius: 8, padding: '10px 12px', fontFamily: 'inherit',
  fontSize: 13, color: 'var(--text)', outline: 'none'
};
function fieldIdentity(props, prefix) {
  const reactId = useId();
  const id = props.id || props.name || `${prefix}-${reactId.replace(/:/g, '')}`;
  const name = props.name || id;
  return { id, name };
}

export function Input(props) {
  const identity = fieldIdentity(props, 'input');
  return <input style={inputStyle} {...identity} {...props} />;
}
export function Select({ children, ...props }) {
  const identity = fieldIdentity(props, 'select');
  return <select style={{ ...inputStyle, cursor:'pointer' }} {...identity} {...props}>{children}</select>;
}
export function Textarea(props) {
  const identity = fieldIdentity(props, 'textarea');
  return <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} {...identity} {...props} />;
}

// ── CupoBar ──
export function CupoBar({ actual, max }) {
  const pct = max > 0 ? Math.round((actual / max) * 100) : 0;
  const color = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--amber)' : 'var(--green)';
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{actual}/{max} inscritos</div>
      <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden', width: 80 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width .5s' }} />
      </div>
    </div>
  );
}

// ── Toast ──
import { useState, useEffect, useId, isValidElement, cloneElement } from 'react';
export function useToast() {
  const [toast, setToast] = useState(null);
  function show(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }
  return { toast, show };
}
export function Toast({ toast }) {
  if (!toast) return null;
  const color = toast.type === 'error' ? 'var(--red)' : 'var(--green)';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--bg2)', border: `1px solid ${color}40`,
      borderRadius: 10, padding: '12px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 13, boxShadow: 'var(--shadow)', zIndex: 9999,
      animation: 'fadeUp .3s ease', color: 'var(--text)'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {toast.msg}
    </div>
  );
}

// ── Spinner ──
export function Spinner() {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'60px 0', color:'var(--text3)' }}>
      Cargando…
    </div>
  );
}

// ── EmptyState ──
export function EmptyState({ msg = 'Sin datos' }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text3)', fontSize:14 }}>
      {msg}
    </div>
  );
}
