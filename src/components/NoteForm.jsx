import { useEffect, useState } from 'react';
import { Button } from './Button.jsx';
import { Input } from './Input.jsx';

const emptyNote = { title: '', content: '' };

export function NoteForm({ selectedNote, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyNote);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(selectedNote || emptyNote);
  }, [selectedNote]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    const ok = await onSubmit({
      id: selectedNote?.id,
      title: form.title.trim(),
      content: form.content.trim(),
    });
    setSaving(false);

    if (ok) setForm(emptyNote);
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <div>
        <h2>{selectedNote ? 'Modifier la note' : 'Nouvelle note'}</h2>
        <p>Gardez une idée, une tâche ou un rappel important.</p>
      </div>

      <Input
        id="note-title"
        label="Titre"
        value={form.title}
        onChange={(event) => updateField('title', event.target.value)}
        placeholder="Ex: Appeler un client"
        required
      />

      <Input
        id="note-content"
        label="Contenu"
        textarea
        rows="5"
        value={form.content}
        onChange={(event) => updateField('content', event.target.value)}
        placeholder="Écrivez quelques détails utiles."
      />

      <div className="actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : selectedNote ? 'Enregistrer' : 'Ajouter'}
        </Button>
        {selectedNote && (
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
