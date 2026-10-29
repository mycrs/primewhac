-- Production security hardening: public data is exposed only through the
-- minimum necessary policies/views. Apply this migration before deploying the
-- corresponding frontend build.

-- Keep the admin predicate server-side and shared by all admin-only policies.
CREATE OR REPLACE FUNCTION public.is_customers_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.is_admin IS TRUE
      AND lower(trim(au.email)) = lower(trim(COALESCE(
        auth.jwt() ->> 'email',
        auth.jwt() #>> '{user_metadata,email}',
        ''
      )))
  );
$$;

REVOKE ALL ON FUNCTION public.is_customers_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_customers_admin() TO authenticated;

-- Remove every existing policy first: previous dashboard-created policies may
-- have permitted anonymous writes. Service role bypasses RLS and is unaffected.
DO $$
DECLARE
  target_table text;
  target_policy text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'site_content',
    'blog_posts',
    'setup_pages',
    'package_types',
    'customer_reviews'
  ]
  LOOP
    IF to_regclass('public.' || target_table) IS NOT NULL THEN
      FOR target_policy IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = target_table
      LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_policy, target_table);
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- CMS: anonymous users can read only the keys rendered on the public site;
-- only an authenticated admin can create, change, or remove any CMS entry.
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.site_content FROM PUBLIC;
GRANT SELECT ON TABLE public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_content TO authenticated;

CREATE POLICY site_content_select_public
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (key IN (
    'aboutData', 'appsData', 'blogSeo', 'channelsData', 'chatBotData',
    'contact_info', 'contactData', 'detailedGuidesData', 'faqData',
    'featureToggles', 'font_optimization_settings', 'footer_contact_info',
    'globalAlert', 'heroData', 'installationData', 'installationPageData',
    'iptvFlowDevicesData', 'm3uConverterSeo', 'moviesData', 'packagesData',
    'packagesPageContent', 'resellerData', 'seoData', 'sitemap_pages',
    'siteTexts', 'statsConfig', 'statsData', 'team_logos',
    'welcome_hero_active_image', 'welcome_image', 'welcome_images'
  ));

CREATE POLICY site_content_admin_all
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

-- Blog: visitors can read only published posts. All authoring is admin-only.
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.blog_posts FROM PUBLIC;
GRANT SELECT ON TABLE public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.blog_posts TO authenticated;

CREATE POLICY blog_posts_select_published
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published_at IS NOT NULL);

CREATE POLICY blog_posts_admin_all
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

-- Setup data is administration-only. It must never be reachable through the
-- anonymous PostgREST API.
ALTER TABLE public.setup_pages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.setup_pages FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.setup_pages TO authenticated;

CREATE POLICY setup_pages_admin_all
  ON public.setup_pages
  FOR ALL
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

-- Package infrastructure stays private. The public form reads this narrow,
-- security-definer view instead of the base table.
ALTER TABLE public.package_types ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.package_types FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.package_types TO authenticated;

CREATE POLICY package_types_admin_all
  ON public.package_types
  FOR ALL
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE OR REPLACE VIEW public.public_package_types
  WITH (security_barrier = true)
AS
  SELECT id, name, is_active, sort_order
  FROM public.package_types
  WHERE is_active IS TRUE;

REVOKE ALL ON TABLE public.public_package_types FROM PUBLIC;
GRANT SELECT ON TABLE public.public_package_types TO anon, authenticated;

-- A view is required for column-level protection: RLS filters rows, not
-- columns. E-mail addresses remain available only to authenticated admins.
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.customer_reviews FROM PUBLIC;
GRANT INSERT ON TABLE public.customer_reviews TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.customer_reviews TO authenticated;

CREATE POLICY customer_reviews_insert_public
  ON public.customer_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND consent_accepted IS TRUE
    AND char_length(trim(author_display_name)) BETWEEN 2 AND 80
    AND char_length(trim(body)) BETWEEN 20 AND 2000
    AND rating BETWEEN 1 AND 5
    AND locale IN ('tr', 'de')
    AND subscription_months IS NOT NULL
    AND subscription_months BETWEEN 1 AND 60
    AND customer_since_months IS NOT NULL
    AND customer_since_months BETWEEN 1 AND 120
    AND COALESCE(is_featured, false) = false
    AND (
      reviewer_email IS NULL
      OR trim(reviewer_email) = ''
      OR (
        char_length(trim(reviewer_email)) BETWEEN 5 AND 254
        AND trim(reviewer_email) ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
      )
    )
  );

CREATE POLICY customer_reviews_admin_all
  ON public.customer_reviews
  FOR ALL
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE OR REPLACE VIEW public.public_customer_reviews
  WITH (security_barrier = true)
AS
  SELECT
    id,
    author_display_name,
    rating,
    body,
    locale,
    status,
    subscription_months,
    customer_since_months,
    is_featured,
    created_at,
    moderated_at
  FROM public.customer_reviews
  WHERE status = 'approved';

REVOKE ALL ON TABLE public.public_customer_reviews FROM PUBLIC;
GRANT SELECT ON TABLE public.public_customer_reviews TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
