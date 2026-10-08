import { getPlayerId, supabase } from './supabase'

// Guarda una partida terminada. Nunca lanza: el juego debe funcionar sin conexión.
export async function saveGame({ mode, winner, winningLine, moves, durationMs }) {
  try {
    const playerId = await getPlayerId()
    if (!playerId) return
    const { error } = await supabase.from('games').insert({
      player_id: playerId,
      mode,
      winner,
      winning_line: winningLine,
      moves,
      move_count: moves.length,
      duration_ms: durationMs,
    })
    if (error) throw error
  } catch (e) {
    console.warn('No se pudo guardar la partida', e)
  }
}

// Devuelve el marcador acumulado { X, O, D } del jugador, o null si no hay datos.
export async function loadScore() {
  try {
    const playerId = await getPlayerId()
    if (!playerId) return null
    const { data, error } = await supabase.from('player_stats').select('*').eq('player_id', playerId)
    if (error) throw error
    return data.reduce(
      (s, r) => ({ X: s.X + r.wins_x, O: s.O + r.wins_o, D: s.D + r.draws }),
      { X: 0, O: 0, D: 0 },
    )
  } catch (e) {
    console.warn('No se pudo cargar el marcador', e)
    return null
  }
}
