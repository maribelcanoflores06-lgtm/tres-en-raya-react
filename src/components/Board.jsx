import Cell from './Cell'

export default function Board({ cells, winLine, locked, onPlay }) {
  return (
    <div className="board">
      {cells.map((value, i) => (
        <Cell
          key={i}
          index={i}
          value={value}
          win={winLine.includes(i)}
          disabled={locked || !!value}
          onClick={() => onPlay(i)}
        />
      ))}
    </div>
  )
}
