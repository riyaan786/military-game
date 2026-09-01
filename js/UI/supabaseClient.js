// ============================================
// COMMAND CHAOS — Supabase Client
// ============================================

const SUPABASE_URL = 'https://yucacsqdtfbpmobisvfj.supabase.co'
const SUPABASE_KEY = 'sb_publishable_yr4CNhk2I4CtyqgOop-Nhw_N6vY4ZZO'

// Import Supabase from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.4/+esm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)


// ============================================
// AUTH
// ============================================

// Sign Up
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

     // Create profile after sign up (best-effort — the auth above is what matters;
  // profiles table is metadata only and shouldn't block signup if missing)
  try {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      username,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn('[supabase] profiles insert skipped (table may be absent):', e.message);
  }

  return data.user
}

// Login
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

    // Update last login (best-effort — the auth sign-in above is what matters;
  // profiles table is metadata only and shouldn't block login if missing)
  try { await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id); }
  catch (e) { console.warn('[supabase] profiles.last_login update skipped (table may be absent):', e.message); }

  return data.user
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Google OAuth login (redirect flow)
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
            redirectTo: window.location.origin + '/'
    }
  })
  if (error) throw error
  return data
}

// Get current logged in user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Listen to auth state changes (call this on page load)
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user ?? null)
  })
}


// ============================================
// PROFILE
// ============================================

// Get player profile
export async function getProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Update username
export async function updateUsername(username) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  if (error) throw error
}


// ============================================
// SUBSCRIPTIONS
// ============================================

// Get active subscription
export async function getSubscription() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  return data ?? null
}

// Check if player has access to the game
export async function hasAccess() {
  const sub = await getSubscription()
  if (!sub) return false
  if (sub.expires_at && new Date(sub.expires_at) < new Date()) return false
  return true
}


// ============================================
// PAYMENTS
// ============================================

// Get payment history
export async function getPayments() {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}


// ============================================
// GAME SAVES
// ============================================

// Save game (upsert = create or update)
export async function saveGame(slot, saveData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { error } = await supabase
    .from('game_saves')
    .upsert({
      user_id: user.id,
      save_slot: slot,
      save_data: saveData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, save_slot' })

  if (error) throw error
}

// Load a specific save slot
export async function loadGame(slot) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', user.id)
    .eq('save_slot', slot)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.save_data ?? null
}

// Load all save slots for the player
export async function getAllSaves() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', user.id)
    .order('save_slot', { ascending: true })

  if (error) throw error
  return data
}

// Delete a save slot
export async function deleteSave(slot) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const { error } = await supabase
    .from('game_saves')
    .delete()
    .eq('user_id', user.id)
    .eq('save_slot', slot)

  if (error) throw error
}