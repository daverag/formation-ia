import { supabase } from './supabaseClient.js';

export async function getNotes(userId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createNote({ userId, title, content }) {
  const { data, error } = await supabase
    .from('notes')
    .insert({ user_id: userId, title, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote({ id, title, content }) {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}
