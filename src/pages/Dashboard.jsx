import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { Feedback } from '../components/Feedback.jsx';
import { NoteForm } from '../components/NoteForm.jsx';
import { NotesList } from '../components/NotesList.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNotes } from '../hooks/useNotes.js';
import { getUserName } from '../utils/errors.js';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { notes, loading, message, error, addNote, saveNote, removeNote } = useNotes(user.id);
  const [selectedNote, setSelectedNote] = useState(null);

  async function handleSubmit(note) {
    const ok = selectedNote ? await saveNote(note) : await addNote(note);
    if (ok) setSelectedNote(null);
    return ok;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Bonjour, {getUserName(user)}</h1>
        </div>
        <Button variant="secondary" onClick={signOut}>
          Logout
        </Button>
      </header>

      <section className="dashboard-grid">
        <Card>
          <NoteForm
            selectedNote={selectedNote}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedNote(null)}
          />
        </Card>

        <Card className="notes-card">
          <div className="section-heading">
            <div>
              <h2>Notes</h2>
              <p>{notes.length} note{notes.length > 1 ? 's' : ''} enregistrée{notes.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <Feedback type="success">{message}</Feedback>
          <Feedback type="error">{error}</Feedback>

          {loading ? (
            <p className="muted">Chargement des notes...</p>
          ) : (
            <NotesList notes={notes} onEdit={setSelectedNote} onDelete={removeNote} />
          )}
        </Card>
      </section>
    </main>
  );
}
