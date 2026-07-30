import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://kjtsyhikseofujiquebp.supabase.co';
const supabaseKey = 'sb_publishable_XbPtBuHE-VDRrJEDSB_Ilg_JuqhrLvt';

export const supabase = createClient(supabaseUrl, supabaseKey);
