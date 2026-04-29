import { supabase } from './supabaseClient.js';

export async function getManagedUsers(ownerId) {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createManagedUser({ ownerId, name, email, role }) {
  const { data, error } = await supabase
    .from('app_users')
    .insert({ owner_id: ownerId, name, email, role })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateManagedUserRole({ id, role }) {
  const { data, error } = await supabase
    .from('app_users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteManagedUser(id) {
  const { error } = await supabase.from('app_users').delete().eq('id', id);
  if (error) throw error;
}
