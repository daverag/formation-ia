import { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout.jsx';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Feedback } from '../components/Feedback.jsx';
import { Input } from '../components/Input.jsx';
import { NoteForm } from '../components/NoteForm.jsx';
import { NotesList } from '../components/NotesList.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useManagedUsers } from '../hooks/useManagedUsers.js';
import { useNotes } from '../hooks/useNotes.js';
import { getUserName } from '../utils/errors.js';

const roleOptions = [
  { value: 'client', label: 'Client' },
  { value: 'collaborateur', label: 'Collaborateur' },
  { value: 'admin', label: 'Admin' },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { notes, loading, message, error, addNote, saveNote, removeNote } = useNotes(user.id);
  const {
    managedUsers,
    usersLoading,
    usersMessage,
    usersError,
    addManagedUser,
    changeManagedUserRole,
    removeManagedUser,
  } = useManagedUsers(user.id);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const userName = getUserName(user);
  const pageTitle = getPageTitle(activePage);

  async function handleSubmit(note) {
    const ok = selectedNote ? await saveNote(note) : await addNote(note);
    if (ok) setSelectedNote(null);
    return ok;
  }

  return (
    <AdminLayout
      activePage={activePage}
      title={pageTitle}
      userName={userName}
      userEmail={user.email}
      onNavigate={setActivePage}
      onSignOut={signOut}
    >
      <main className="dashboard-page">
        {activePage === 'dashboard' && (
          <DashboardOverview
            loading={loading}
            notes={notes}
            selectedNote={selectedNote}
            onOpenNotes={() => setActivePage('notes')}
          />
        )}

        {activePage === 'notes' && (
          <NotesPage
            error={error}
            loading={loading}
            message={message}
            notes={notes}
            selectedNote={selectedNote}
            onCancel={() => setSelectedNote(null)}
            onDelete={removeNote}
            onEdit={setSelectedNote}
            onSubmit={handleSubmit}
          />
        )}

        {activePage === 'users' && (
          <UsersPage
            currentUser={user}
            managedUsers={managedUsers}
            message={usersMessage}
            error={usersError}
            loading={usersLoading}
            onAdd={addManagedUser}
            onDelete={removeManagedUser}
            onRoleChange={changeManagedUserRole}
            userName={userName}
          />
        )}

        {activePage === 'settings' && <SettingsPage userEmail={user.email} />}
      </main>
    </AdminLayout>
  );
}

function DashboardOverview({ loading, notes, selectedNote, onOpenNotes }) {
  const recentNotes = notes.slice(0, 3);

  return (
    <>
      <section className="metrics-grid" aria-label="Apercu">
        <MetricCard label="Notes actives" value={notes.length} helper="Elements sauvegardes" />
        <MetricCard label="Mode" value={selectedNote ? 'Edition' : 'Creation'} helper="Action en cours" />
        <MetricCard label="Statut" value={loading ? 'Sync' : 'Pret'} helper="Connexion Supabase" />
      </section>

      <section className="admin-content-grid">
        <Card className="wide-card">
          <div className="section-heading horizontal">
            <div>
              <h2>Activite recente</h2>
              <p>Les dernieres notes ajoutees dans votre espace.</p>
            </div>
            <Button variant="secondary" onClick={onOpenNotes}>
              Voir les notes
            </Button>
          </div>

          {loading ? (
            <p className="muted">Chargement des notes...</p>
          ) : recentNotes.length ? (
            <NotesList notes={recentNotes} onEdit={onOpenNotes} onDelete={() => {}} showActions={false} />
          ) : (
            <p className="muted">Aucune activite pour le moment.</p>
          )}
        </Card>

        <Card>
          <div className="section-heading">
            <h2>Etat du compte</h2>
            <p>Votre espace est pret pour la saisie et la gestion des notes.</p>
          </div>
          <div className="status-list">
            <StatusRow label="Authentification" value="Active" />
            <StatusRow label="Base de donnees" value="Connectee" />
            <StatusRow label="Role" value="Admin" />
          </div>
        </Card>
      </section>
    </>
  );
}

function NotesPage({ error, loading, message, notes, selectedNote, onCancel, onDelete, onEdit, onSubmit }) {
  return (
    <section className="dashboard-grid">
      <Card className="form-panel">
        <NoteForm selectedNote={selectedNote} onSubmit={onSubmit} onCancel={onCancel} />
      </Card>

      <Card className="notes-card">
        <div className="section-heading horizontal">
          <div>
            <h2>Notes</h2>
            <p>
              {notes.length} note{notes.length > 1 ? 's' : ''} enregistree
              {notes.length > 1 ? 's' : ''}
            </p>
          </div>
          {selectedNote && (
            <Button variant="secondary" onClick={onCancel}>
              Nouvelle note
            </Button>
          )}
        </div>

        <Feedback type="success">{message}</Feedback>
        <Feedback type="error">{error}</Feedback>

        {loading ? (
          <p className="muted">Chargement des notes...</p>
        ) : (
          <NotesList notes={notes} onEdit={onEdit} onDelete={onDelete} />
        )}
      </Card>
    </section>
  );
}

function UsersPage({
  currentUser,
  managedUsers,
  message,
  error,
  loading,
  onAdd,
  onDelete,
  onRoleChange,
  userName,
}) {
  return (
    <section className="users-page-grid">
      <Card className="user-form-card">
        <UserForm onAdd={onAdd} />
      </Card>

      <Card className="wide-card">
        <div className="section-heading">
          <h2>Utilisateurs</h2>
          <p>Ajoutez des utilisateurs et assignez leur role.</p>
        </div>

        <Feedback type="success">{message}</Feedback>
        <Feedback type="error">{error}</Feedback>

        <div className="table-shell">
          <div className="table-row users-table-row table-head">
            <span>Nom</span>
            <span>Email</span>
            <span>Role</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>
          <div className="table-row users-table-row">
            <strong data-label="Nom">{userName}</strong>
            <span data-label="Email">{currentUser.email}</span>
            <span data-label="Role">Admin</span>
            <span data-label="Statut">
              <span className="pill">Connecte</span>
            </span>
            <span className="muted" data-label="Actions">
              Compte actuel
            </span>
          </div>

          {loading ? (
            <p className="muted">Chargement des utilisateurs...</p>
          ) : !managedUsers.length ? (
            <p className="muted">Aucun utilisateur ajoute pour le moment.</p>
          ) : (
            managedUsers.map((managedUser) => (
              <div className="table-row users-table-row" key={managedUser.id}>
                <strong data-label="Nom">{managedUser.name}</strong>
                <span data-label="Email">{managedUser.email}</span>
                <span data-label="Role">
                  <select
                    aria-label={`Role de ${managedUser.name}`}
                    className="select-control compact"
                    value={managedUser.role}
                    onChange={(event) => onRoleChange(managedUser.id, event.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </span>
                <span data-label="Statut">
                  <span className="pill">Actif</span>
                </span>
                <span data-label="Actions">
                  <Button variant="danger" onClick={() => onDelete(managedUser.id)}>
                    Supprimer
                  </Button>
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}

function UserForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'client' });
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setSaving(true);
    const ok = await onAdd({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
    });
    setSaving(false);

    if (ok) setForm({ name: '', email: '', role: 'client' });
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div>
        <h2>Nouvel utilisateur</h2>
        <p>Ajoutez une personne et choisissez son niveau d'acces.</p>
      </div>

      <Input
        id="managed-user-name"
        label="Nom"
        value={form.name}
        onChange={(event) => updateField('name', event.target.value)}
        placeholder="Ex: Marie Tremblay"
        required
      />

      <Input
        id="managed-user-email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(event) => updateField('email', event.target.value)}
        placeholder="marie@exemple.com"
        required
      />

      <label className="field" htmlFor="managed-user-role">
        <span>Role</span>
        <select
          className="select-control"
          id="managed-user-role"
          value={form.role}
          onChange={(event) => updateField('role', event.target.value)}
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </label>

      <Button type="submit" disabled={saving}>
        {saving ? 'Ajout...' : 'Ajouter'}
      </Button>
    </form>
  );
}

function SettingsPage({ userEmail }) {
  return (
    <div className="settings-grid">
      <Card>
        <div className="section-heading">
          <h2>Profil</h2>
          <p>Informations principales du compte connecte.</p>
        </div>
        <div className="status-list">
          <StatusRow label="Email" value={userEmail} />
          <StatusRow label="Langue" value="Francais" />
          <StatusRow label="Environnement" value="Staging" />
        </div>
      </Card>

      <Card>
        <div className="section-heading">
          <h2>Preferences</h2>
          <p>Parametres d'affichage de l'interface admin.</p>
        </div>
        <div className="toggle-list">
          <label className="toggle-row">
            <span>Navigation compacte</span>
            <input type="checkbox" />
          </label>
          <label className="toggle-row">
            <span>Notifications email</span>
            <input defaultChecked type="checkbox" />
          </label>
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <Card className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </Card>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getPageTitle(page) {
  const titles = {
    dashboard: 'Dashboard',
    notes: 'Notes',
    users: 'Utilisateurs',
    settings: 'Parametres',
  };

  return titles[page] || titles.dashboard;
}
