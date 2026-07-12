-- Add notification preferences to profiles for CRM Settings > Notifications tab.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_prefs JSONB NOT NULL DEFAULT jsonb_build_object(
  'newLeads', true,
  'partnerStatus', true,
  'catalogChanges', false,
  'emailReports', true
);
