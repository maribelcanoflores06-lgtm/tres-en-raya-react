export default function ModeToggle({ vsCpu, onChange }) {
  return (
    <div className="modes" role="group" aria-label="Modo de juego">
      <button aria-pressed={!vsCpu} onClick={() => onChange(false)}>2 jugadores</button>
      <button aria-pressed={vsCpu} onClick={() => onChange(true)}>Vs computadora</button>
    </div>
  )
}
