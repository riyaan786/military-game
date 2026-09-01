// ============================================================================
// supabaseBridge.js
// ----------------------------------------------------------------------------
// The Supabase client (js/UI/supabaseClient.js) is written as an ES MODULE
// (it uses `import { createClient } from '...cdn...'` and `export`).
// commandChaos/game.js is a classic (non-module) script and cannot import it
// directly, so this bridge dynamically imports the module and exposes the
// public API on `window.cmoSupabase` for game.js to call.
//
// Load this BEFORE game.js (see index.html). window.cmoSupabase is set
// ASYNCHRONOUSLY once the module + CDN SDK resolve. game.js only reads it from
// click handlers, so the small async gap is safe — until it's ready, save/load
// silently uses localStorage.
// ============================================================================
window.cmoSupabaseReady = false;
window.cmoSupabase = null;

import('./js/UI/supabaseClient.js')
  .then(function (mod) {
    // Normalise the client surface so game.js / index.html gate code can rely on
    // a single, consistent API regardless of how supabaseClient.js is written.
    window.cmoSupabase = {
      // raw Supabase client (for direct .from() table reads if needed)
      supabase: mod.supabase,

      // ---- auth ----
      async login  (email, password)                              { return mod.login(email, password); },
      async signUp (email, password, username = 'pilot')          { return mod.signUp(email, password, username); },
      async signUpSimple(email, password)                         { return mod.signUp(email, password, 'pilot'); },
      async logout()                                             { return mod.logout(); },
              async getUser()                                            { return mod.getCurrentUser(); },
      onAuthChange(cb)                                           { return mod.onAuthChange(cb); },
      async loginWithGoogle()                                     { return mod.loginWithGoogle(); },

      // ---- convenience flags (reactive) ----
      isAuthenticated: false,
      userEmail: null,

      // ---- save / load (cloud-first, local fallback) ----
      async saveGame(slot, data) {
        try {
          const user = await mod.getCurrentUser();
          if (user) {
            const { error } = await mod.supabase
              .from('game_saves')
              .upsert({ user_id: user.id, save_slot: slot, save_data: data, updated_at: new Date().toISOString() }, { onConflict: 'user_id,save_slot' });
            if (!error) { console.log('[supabase] cloud save ✓', slot); return true; }
            console.warn('[supabase] cloud save failed, falling back:', error.message);
          }
        } catch (e) { console.warn('[supabase] save threw:', e); }
        // local fallback
        try { localStorage.setItem('cmo_save_' + slot, JSON.stringify(data)); console.log('[supabase] local save ✓', slot); return true; }
        catch (e) { console.error('local save failed:', e); return false; }
      },

            async loadGame(slot) {
        try {
          const user = await mod.getCurrentUser();
          if (user) {
            const { data, error } = await mod.supabase.from('game_saves').select('save_data').eq('user_id', user.id).eq('save_slot', slot).single();
            if (!error && data) { console.log('[supabase] cloud load ✓', slot); return data.save_data; }
            if (error) console.warn('[supabase] cloud load fallback:', error.message);
          }
        } catch (e) { console.warn('[supabase] load threw:', e); }
        // local fallback
        try { const raw = localStorage.getItem('cmo_save_' + slot); if (raw) { console.log('[supabase] local load ✓', slot); return JSON.parse(raw); } }
        catch (e) { console.error('local load failed:', e); }
        return null;
      },

      // ---- list & delete (for the 10-slot picker) ----
            async getAllSaves() {
        try {
          const user = await mod.getCurrentUser();
          if (!user) return {};
          const { data, error } = await mod.supabase
            .from('game_saves')
            .select('save_slot, save_data')
            .eq('user_id', user.id);
          if (error) { console.warn('[supabase] getAllSaves failed:', error.message); return {}; }
          // Convert array to keyed object: { 1: {save_data: {...}}, 2: {...}, ... }
          const result = {};
          if (data && data.length) {
            data.forEach(row => { result[row.save_slot] = { save_data: row.save_data }; });
          }
          return result;
        } catch (e) { console.warn('[supabase] getAllSaves threw:', e); return {}; }
      },

      async deleteSave(slot) {
        try {
          // cloud delete
          const user = await mod.getCurrentUser();
          if (user) {
            const { error } = await mod.supabase
              .from('game_saves')
              .delete()
              .eq('user_id', user.id)
              .eq('save_slot', slot);
            if (error) console.warn('[supabase] cloud delete failed:', error.message);
          }
        } catch (e) { console.warn('[supabase] delete threw:', e); }
        // local delete
        try { localStorage.removeItem('cmo_save_' + slot); console.log('[supabase] local delete ✓', slot); } catch(e) {}
        return true;
      }
    };

    // Keep the reactive flags in sync with auth state.

          mod.onAuthChange((event, session) => {
      window.cmoSupabase.isAuthenticated = !!session?.user;
      window.cmoSupabase.userEmail = session?.user?.email ?? null;
      // _cmoAuthed is NOT set here — it is only set by passGate() in index.html
      // when the user EXPLICITLY logs in (tracked via sessionStorage flag).
      // This prevents the login gate from being auto-bypassed on page load.
      console.log('[supabase] auth change:', event, session?.user?.email ?? '(none)');
    });
    // onAuthChange doesn't always fire on first load, so probe initial session.
    // We read the session to update isAuthenticated/userEmail flags but do NOT
    // auto-pass the login gate — the user must explicitly click "Google Sign In".
    (async () => {
      try {
                const u = await mod.getCurrentUser();
                window.cmoSupabase.isAuthenticated = !!u;
        window.cmoSupabase.userEmail = u?.email ?? null;
        // Do NOT set window._cmoAuthed — only passGate() in index.html sets it
        if (u) console.log('[supabase] initial session →', u.email);
      } catch (e) { console.warn('[supabase] initial session probe failed:', e); }
    })();

    window.cmoSupabaseReady = true;
    console.log('[supabase] connected ✓  — cloud save/load available');
  })
  .catch(function (e) {
    console.warn('[supabase] module load failed — save/load falls back to localStorage:', e);
    window.cmoSupabaseReady = false;
  });
