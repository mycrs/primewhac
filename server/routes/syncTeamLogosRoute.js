import { runSyncTeamLogos } from '../api/syncTeamLogos.js';

export function registerSyncTeamLogosRoute(app, requireSupabaseAdmin) {
  app.post('/api/admin/sync-team-logos', requireSupabaseAdmin, async (req, res) => {
    try {
      const result = await runSyncTeamLogos(req.supabaseService, {
        log: (line) => console.log('[sync-team-logos]', line),
        upsert: true,
      });
      res.json(result);
    } catch (err) {
      console.error('[POST /api/admin/sync-team-logos]', err?.message || err);
      res.status(500).json({
        success: false,
        error: err?.message || 'Senkron başarısız',
      });
    }
  });
}
