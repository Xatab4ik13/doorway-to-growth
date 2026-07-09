-- Rename lead stage 'contract' → 'paid'
UPDATE public.leads SET stage = 'paid' WHERE stage = 'contract';
