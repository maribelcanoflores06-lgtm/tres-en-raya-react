import { useEffect, useRef, useState } from 'react'
import Board from './components/Board'
import Scoreboard from './components/Scoreboard'
import ModeToggle from './components/ModeToggle'
import { cpuMove, getWinner } from './lib/game'
import { playDraw, playMove, playWin } from './lib/sound'
import { loadScore, saveGame } from './lib/storage'
import './App.css'

const EMPTY = Array(9).fill('')
const CONFETTI = Array.from({ length: 24 }, (_, i) => i)

export default function App() {
  const [cells, setCells] = useState(EMPTY)
  const [turn, setTurn] = useState('X')
  const [score, setScore] = useState({ X: 0, O: 0, D: 0 })
  const [vsCpu, setVsCpu] = useState(false)
  const [muted, setMuted] = useState(false)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const movesRef = useRef([])
  const startRef = useRef(0)

  const result = getWinner(cells)
  const draw = !result && cells.every(Boolean)
  const over = !!result || draw
  const cpuTurn = vsCpu && turn === 'O' && !over

  const sound = (fn, ...args) => {
    if (!mutedRef.current) fn(...args)
  }

  function play(i) {
    if (over || cells[i] || cpuTurn) return
    place(i, turn)
  }

  function place(i, player) {
    const next = cells.slice()
    next[i] = player
    setCells(next)
    if (!movesRef.current.length) startRef.current = Date.now()
    movesRef.current.push({ player, cell: i })
    const w = getWinner(next)
    const full = next.every(Boolean)
    if (w || full) {
      saveGame({
        mode: vsCpu ? 'cpu' : 'pvp',
        winner: w ? w.player : 'draw',
        winningLine: w ? w.line : null,
        moves: movesRef.current,
        durationMs: Date.now() - startRef.current,
      })
    }
    if (w) {
      setScore((s) => ({ ...s, [w.player]: s[w.player] + 1 }))
      sound(playWin)
    } else if (full) {
      setScore((s) => ({ ...s, D: s.D + 1 }))
      sound(playDraw)
    } else {
      setTurn(player === 'X' ? 'O' : 'X')
      sound(playMove, player)
    }
  }

  useEffect(() => {
    if (!cpuTurn) return
    const id = setTimeout(() => place(cpuMove(cells), 'O'), 450)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuTurn, cells])

  useEffect(() => {
    loadScore().then((s) => s && setScore(s))
  }, [])

  function reset() {
    movesRef.current = []
    setCells(EMPTY)
    setTurn('X')
  }

  function changeMode(cpu) {
    setVsCpu(cpu)
    reset()
  }

  let status = `Turno de ${turn}`
  if (result) status = `¡Ganó ${result.player}!`
  else if (draw) status = 'Empate'
  else if (cpuTurn) status = 'La computadora piensa…'

  return (
    <main>
      <h1>Tres en raya</h1>
      <ModeToggle vsCpu={vsCpu} onChange={changeMode} />
      <div className={`status${over ? ' over' : ''}`} aria-live="polite">{status}</div>
      <Board cells={cells} winLine={result ? result.line : []} locked={over || cpuTurn} onPlay={play} />
      <Scoreboard score={score} />
      <div className="actions">
        <button onClick={reset}>Reiniciar</button>
        <button onClick={() => setMuted((m) => !m)} aria-pressed={muted}>
          {muted ? '🔇 Sonido apagado' : '🔊 Sonido'}
        </button>
      </div>
      {result && (
        <div className="confetti" aria-hidden="true">
          {CONFETTI.map((i) => (
            <span
              key={i}
              style={{
                left: `${(i * 97) % 100}%`,
                animationDelay: `${(i % 8) * 0.07}s`,
                background: `hsl(${(i * 47) % 360} 85% 60%)`,
              }}
            />
          ))}
        </div>
      )}
    </main>
  )
}
