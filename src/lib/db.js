import { supabase } from './supabase';

/* ── services ─────────────────────────────────── */

export async function fetchServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertServices(items) {
  if (!items.length) return;
  const { error } = await supabase.from('services').upsert(items, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteService(id) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

/* ── cash_entries ─────────────────────────────── */

export async function fetchCashEntries() {
  const { data, error } = await supabase
    .from('cash_entries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCashEntries(items) {
  if (!items.length) return;
  const { error } = await supabase.from('cash_entries').upsert(items, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteCashEntry(id) {
  const { error } = await supabase.from('cash_entries').delete().eq('id', id);
  if (error) throw error;
}

/* ── helpers ──────────────────────────────────── */

/**
 * Diff two arrays and return { upserted, deleted }.
 * Used by the App to sync only what changed.
 */
export function diffArrays(oldArr, newArr) {
  const deleted = oldArr.filter((o) => !newArr.find((n) => n.id === o.id));
  const upserted = newArr.filter((n) => {
    const old = oldArr.find((o) => o.id === n.id);
    return !old || JSON.stringify(old) !== JSON.stringify(n);
  });
  return { upserted, deleted };
}
