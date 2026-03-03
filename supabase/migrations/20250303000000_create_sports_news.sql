-- Spor Gündemi tablosu - otomatik çekilen ve yeniden yazılan spor haberleri
CREATE TABLE IF NOT EXISTS public.sports_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  source_url TEXT,
  source_name TEXT,
  category TEXT DEFAULT 'Spor',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  original_title TEXT,
  original_excerpt TEXT
);

-- Slug oluşturmak için yardımcı fonksiyon
CREATE OR REPLACE FUNCTION generate_sports_news_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  base_slug := lower(regexp_replace(
    regexp_replace(trim(title), '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
  base_slug := substring(base_slug from 1 for 80);
  
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM sports_news WHERE sports_news.slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Benzersizlik için source_url + published_at index
CREATE UNIQUE INDEX IF NOT EXISTS idx_sports_news_source_unique 
  ON sports_news (source_url, published_at) 
  WHERE source_url IS NOT NULL;

-- Liste sorguları için index
CREATE INDEX IF NOT EXISTS idx_sports_news_published 
  ON sports_news (published_at DESC) 
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_sports_news_slug 
  ON sports_news (slug);

-- RLS: Herkes yayınlanmış haberleri okuyabilir
ALTER TABLE sports_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_news_public_read" ON sports_news
  FOR SELECT USING (is_published = true);

-- INSERT/UPDATE için: Service role key kullanan script RLS'i bypass eder
