export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export function getWinner(cells) {
  for (const line of LINES) {
    const [a, b, c] = line
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { player: cells[a], line }
    }
  }
  return null
}

function findLineMove(cells, mark) {
  for (const line of LINES) {
    const vals = line.map((i) => cells[i])
    if (vals.filter((v) => v === mark).length === 2 && vals.includes('')) {
      return line[vals.indexOf('')]
    }
  }
  return -1
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Gana > bloquea > centro > esquina > cualquiera
export function cpuMove(cells, me = 'O', other = 'X') {
  let m = findLineMove(cells, me)
  if (m < 0) m = findLineMove(cells, other)
  if (m < 0 && !cells[4]) m = 4
  if (m < 0) {
    const corners = [0, 2, 6, 8].filter((i) => !cells[i])
    if (corners.length) m = pick(corners)
  }
  if (m < 0) m = pick(cells.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0))
  return m
}
