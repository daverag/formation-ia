export function getFriendlyError(error) {
  const text = error?.message || '';

  if (text.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }

  if (text.includes('User already registered')) {
    return 'Un compte existe déjà avec cet email.';
  }

  if (text.includes('Password')) {
    return 'Le mot de passe doit être plus long.';
  }

  if (text.includes('Failed to fetch') || text.includes('NetworkError')) {
    return 'Connexion impossible. Vérifiez internet et la configuration Supabase.';
  }

  return 'Une erreur est arrivée. Réessayez dans un instant.';
}

export function getUserName(user) {
  return user?.user_metadata?.full_name || user?.email || 'Utilisateur';
}
