-- Duyuru banner görsel teması (info | warning | campaign | urgent | success)
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS theme text DEFAULT 'info';

COMMENT ON COLUMN public.notifications.theme IS 'Banner teması: info, warning, campaign, urgent, success';

-- Geçerli değer yoksa info say
UPDATE public.notifications
SET theme = 'info'
WHERE theme IS NULL OR trim(theme) = '';
