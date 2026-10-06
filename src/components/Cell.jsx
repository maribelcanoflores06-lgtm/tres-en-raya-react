export default function Cell({ value, index, win, disabled, onClick }) {
  const cls = ['cell', value && value.toLowerCase(), win && 'win'].filter(Boolean).join(' ')
  return (
    <button
      className={cls}
      disabled={disabled}
      onClick={onClick}
      aria-label={`Casilla ${index + 1}${value ? ': ' + value : ''}`}
    >
      {value && <span className="mark">{value}</span>}
    </button>
  )
}
