// ===========================================================================
// analytics.js - Simple, lightweight player analytics via Supabase
// ----------------------------------------------------------------------------
// Tracks gameplay sessions, events, and retention metrics.
// All calls are fire-and-forget: analytics NEVER blocks or disrupts gameplay.
// ===========================================================================

(function () {
  'use strict';

  const HEARTBEAT_INTERVAL  = 60 * 1000;  // 60s — update last_activity_at
  const SESSION_TIMEOUT     = 5 * 60 * 1000; // 5 min inactivity → session ended
  const INACTIVITY_CHECK    = 5000;           // check activity every 5s

  window.cmoAnalytics = {
    SESSION_TIMEOUT,
    HEARTBEAT_INTERVAL,

    _sessionId: null,
    _playerId: null,
    _lastActivity: 0,
    _heartbeatTimer: null,
    _inactivityTimer: null,
    _sessionStarted: false,

    _getSupabase() {
      const api = window.cmoSupabase;
      if (!api || !api.isAuthenticated) return null;
      return api.supabase;
    },

    async _getPlayerId() {
      if (this._playerId) return this._playerId;
      if (!window.cmoSupabase || !window._cmoAuthed) return null;
      try {
        const user = await window.cmoSupabase.getUser();
        if (user?.id) { this._playerId = user.id; return user.id; }
      } catch (e) {}
      return null;
        },

    _touch() { this._lastActivity = Date.now(); },

    async trackEvent(eventType, metadata) {
      const sb = this._getSupabase();
      if (!sb) return;
      const playerId = await this._getPlayerId();
      if (!playerId) return;

      if (eventType === 'session_start') {
        if (this._sessionStarted) return;
        this._sessionStarted = true;
        this._touch();
        const { data: sess, error: sessErr } = await sb
          .from('player_sessions')
          .insert({
            player_id: playerId,
            started_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString()
          })
          .select('id')
          .single();
        if (sessErr) { console.warn('[analytics] session insert failed:', sessErr.message); return; }
        this._sessionId = sess.id;
        this._startHeartbeat();
        await sb.from('gameplay_events').insert({
          player_id: playerId,
          session_id: this._sessionId,
          event_type: 'session_start',
          metadata: JSON.stringify(metadata || {}),
          created_at: new Date().toISOString()
        });
        return;
      }

      if (!this._sessionId) return;
      this._touch();

      sb.from('gameplay_events').insert({
        player_id: playerId,
        session_id: this._sessionId,
        event_type: eventType,
        metadata: JSON.stringify(metadata || {}),
        created_at: new Date().toISOString()
      }).catch(err => {
        console.warn('[analytics] event insert failed:', err);
      });
    },

    _startHeartbeat() {
      if (this._heartbeatTimer) return;
      this._heartbeatTimer = setInterval(() => { this._doHeartbeat(); }, HEARTBEAT_INTERVAL);
      this._inactivityTimer = setInterval(() => { this._checkActivity(); }, INACTIVITY_CHECK);
    },

    async _doHeartbeat() {
      const sb = this._getSupabase();
      if (!sb || !this._sessionId || !this._playerId) return;
      sb.from('player_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', this._sessionId)
        .then(() => {
          sb.from('gameplay_events').insert({
            player_id: this._playerId,
            session_id: this._sessionId,
            event_type: 'heartbeat',
            metadata: '{}',
            created_at: new Date().toISOString()
          }).catch(() => {});
        })
        .catch(() => {});
    },

    _checkActivity() {
      if (Date.now() - this._lastActivity > SESSION_TIMEOUT) {
        this.endSession();
      }
    },

    async endSession() {
      if (!this._sessionId) return;
      const sessionId = this._sessionId;
      const playerId = this._playerId;
      if (this._heartbeatTimer) { clearInterval(this._heartbeatTimer); this._heartbeatTimer = null; }
      if (this._inactivityTimer) { clearInterval(this._inactivityTimer); this._inactivityTimer = null; }
      this._sessionStarted = false;
      this._sessionId = null;
      const sb = this._getSupabase();
      if (!sb) return;
      const now = new Date().toISOString();
      sb.from('player_sessions')
        .update({ ended_at: now, last_activity_at: now })
        .eq('id', sessionId)
        .then(() => {
          sb.from('gameplay_events').insert({
            player_id: playerId,
            session_id: sessionId,
            event_type: 'session_end',
            metadata: '{}',
            created_at: now
          }).catch(() => {});
        })
        .catch(() => {});
    },

    isPlaying() {
      if (!this._sessionStarted) return false;
      return (Date.now() - this._lastActivity) < SESSION_TIMEOUT;
    }
  };

  // Track user input as activity
  const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
  activityEvents.forEach(evt => {
    window.addEventListener(evt, () => {
      if (window.cmoAnalytics) window.cmoAnalytics._touch();
    }, { passive: true });
  });

  // End session on page unload
  window.addEventListener('beforeunload', () => {
    if (window.cmoAnalytics && window.cmoAnalytics._sessionStarted) {
      const sb = window.cmoAnalytics._getSupabase();
      if (sb && window.cmoAnalytics._sessionId) {
        const now = new Date().toISOString();
        sb.from('player_sessions')
          .update({ ended_at: now, last_activity_at: now })
          .eq('id', window.cmoAnalytics._sessionId)
          .catch(() => {});
      }
      window.cmoAnalytics._sessionStarted = false;
      if (window.cmoAnalytics._heartbeatTimer) clearInterval(window.cmoAnalytics._heartbeatTimer);
      if (window.cmoAnalytics._inactivityTimer) clearInterval(window.cmoAnalytics._inactivityTimer);
    }
  });

  console.log('[analytics] module loaded');
})();