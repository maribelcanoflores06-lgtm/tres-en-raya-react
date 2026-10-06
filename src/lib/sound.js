let ctx = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, duration, type = 'sine', gain = 0.15) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  const t0 = c.currentTime + start
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export function playMove(player) {
  tone(player === 'X' ? 520 : 390, 0, 0.14, 'triangle')
}

export function playWin() {
  ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.25, 'triangle'))
}

export function playDraw() {
  tone(220, 0, 0.3, 'sawtooth', 0.08)
  tone(165, 0.18, 0.4, 'sawtooth', 0.08)
}
