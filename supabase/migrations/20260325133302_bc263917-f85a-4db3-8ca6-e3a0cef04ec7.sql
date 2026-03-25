
-- Notifications table for CRM
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  detail TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins see all notifications
CREATE POLICY "Admins view all notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins manage notifications
CREATE POLICY "Admins manage notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users see own notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create notification on new lead
CREATE OR REPLACE FUNCTION public.create_lead_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (type, title, detail, related_id)
  VALUES (
    'lead',
    'Новая заявка от ' || NEW.name,
    COALESCE(NEW.message, 'Источник: ' || COALESCE(NEW.source, 'сайт')),
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_lead_notification
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.create_lead_notification();
