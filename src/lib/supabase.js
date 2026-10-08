import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

let playerPromise = null

// Devuelve el id del jugador anónimo (crea sesión y fila en `players` si hace falta).
export function getPlayerId() {
  if (!supabase) return Promise.resolve(null)
  playerPromise ??= (async () => {
    let { data } = await supabase.auth.getSession()
    if (!data.session) {
      const res = await supabase.auth.signInAnonymously()
      if (res.error) throw res.error
      data = res.data
    }
    const id = data.session.user.id
    const { error } = await supabase.from('players').upsert({ id }, { ignoreDuplicates: true })
    if (error) throw error
    return id
  })().catch((e) => {
    playerPromise = null
    throw e
  })
  return playerPromise
}
