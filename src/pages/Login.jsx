import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Feedback } from '../components/Feedback.jsx';
import { Input } from '../components/Input.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { isSupabaseConfigured } from '../services/supabaseClient.js';

export default function Login() {
  const { signIn, signUp, authError } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    const result =
      mode === 'login'
        ? await signIn({ email: form.email, password: form.password })
        : await signUp(form);

    setSubmitting(false);
    if (result.ok && result.message) setMessage(result.message);
  }

  return (
    <main className="auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">Boilerplate simple</p>
        <h1>Une base claire pour lancer une application web.</h1>
        <p>
          Authentification, dashboard et notes sont prêts. Vous pouvez modifier le projet sans
          partir de zéro.
        </p>
      </section>

      <Card className="auth-card">
        <div className="tabs" aria-label="Choisir une action">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Connexion
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
            Inscription
          </button>
        </div>

        {!isSupabaseConfigured && (
          <Feedback type="error">
            Ajoutez vos clés Supabase dans un fichier .env pour activer l’application.
          </Feedback>
        )}

        <form className="form-stack" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <Input
              id="name"
              label="Nom"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Votre nom"
              required
            />
          )}

          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="vous@exemple.com"
            required
          />

          <Input
            id="password"
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Minimum 6 caractères"
            required
          />

          <Feedback type="success">{message}</Feedback>
          <Feedback type="error">{authError}</Feedback>

          <Button type="submit" disabled={!isSupabaseConfigured || submitting}>
            {submitting ? 'Un instant...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
