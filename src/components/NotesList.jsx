import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';

export function NotesList({ notes, onEdit, onDelete }) {
  if (!notes.length) return <EmptyState />;

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <article className="note-item" key={note.id}>
          <div>
            <h3>{note.title}</h3>
            {note.content && <p>{note.content}</p>}
          </div>
          <div className="note-actions">
            <Button variant="secondary" onClick={() => onEdit(note)}>
              Modifier
            </Button>
            <Button variant="danger" onClick={() => onDelete(note.id)}>
              Supprimer
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
