
-- 1. Create sites table
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  domain text UNIQUE,
  city text NOT NULL,
  district text,
  address text,
  description text,
  logo_url text,
  phone text,
  email text,
  website text,
  latitude numeric,
  longitude numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Add site_id to partners
ALTER TABLE public.partners ADD COLUMN site_id uuid REFERENCES public.sites(id);

-- 3. Add site_id to content tables (keeping old partner_id for now)
ALTER TABLE public.partner_banners ADD COLUMN site_id uuid REFERENCES public.sites(id);
ALTER TABLE public.partner_staff ADD COLUMN site_id uuid REFERENCES public.sites(id);
ALTER TABLE public.partner_reviews ADD COLUMN site_id uuid REFERENCES public.sites(id);
ALTER TABLE public.promotions ADD COLUMN site_id uuid REFERENCES public.sites(id);
ALTER TABLE public.leads ADD COLUMN site_id uuid REFERENCES public.sites(id);

-- 4. Enable RLS on sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Sites viewable by all (public storefronts)
CREATE POLICY "Sites viewable by all" ON public.sites
  FOR SELECT TO public USING (true);

-- Admins manage sites
CREATE POLICY "Admins manage sites" ON public.sites
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Partners can update their own site
CREATE POLICY "Partners can update own site" ON public.sites
  FOR UPDATE TO public USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.site_id = sites.id AND partners.user_id = auth.uid())
  );

-- 5. Update trigger for updated_at
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Update content table policies to also allow site-based access
CREATE POLICY "Partners manage own site banners" ON public.partner_banners
  FOR ALL TO public USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.site_id = partner_banners.site_id AND partners.user_id = auth.uid())
  );

CREATE POLICY "Partners manage own site staff" ON public.partner_staff
  FOR ALL TO public USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.site_id = partner_staff.site_id AND partners.user_id = auth.uid())
  );

CREATE POLICY "Partners manage own site reviews" ON public.partner_reviews
  FOR ALL TO public USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.site_id = partner_reviews.site_id AND partners.user_id = auth.uid())
  );

CREATE POLICY "Partners manage own site promotions" ON public.promotions
  FOR ALL TO public USING (
    EXISTS (SELECT 1 FROM partners WHERE partners.site_id = promotions.site_id AND partners.user_id = auth.uid())
  );
