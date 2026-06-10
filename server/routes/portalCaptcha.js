/**
 * hCaptcha doğrulama — isteğe bağlı (Turnstile Edge Function birincil).
 */
export function registerPortalCaptchaRoutes(app) {
  app.post('/api/portal/verify-captcha', async (req, res) => {
    try {
      const secret = process.env.HCAPTCHA_SECRET?.trim();
      const token = req.body?.hcaptchaResponse || req.body?.['h-captcha-response'];
      if (!secret) {
        return res.status(503).json({ ok: false, error: 'HCAPTCHA_SECRET yapılandırılmamış' });
      }
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ ok: false, error: 'Captcha yanıtı gerekli' });
      }
      const form = new URLSearchParams();
      form.set('secret', secret);
      form.set('response', token);
      const r = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      const data = await r.json().catch(() => ({}));
      if (data.success === true) {
        return res.json({ ok: true });
      }
      return res.status(400).json({ ok: false, error: 'Captcha doğrulaması başarısız' });
    } catch (err) {
      console.error('[POST /api/portal/verify-captcha]', err?.message || err);
      res.status(500).json({ ok: false, error: err?.message || 'Doğrulama hatası' });
    }
  });
}
