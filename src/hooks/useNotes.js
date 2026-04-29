import { useEffect, useState } from 'react';
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from '../services/notesService.js';
import { getFriendlyError } from '../utils/errors.js';

export function useNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadNotes() {
    try {
      setLoading(true);
      setError('');
      const data = await getNotes(userId);
      setNotes(data);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadNotes();
  }, [userId]);

  async function addNote(note) {
    try {
      setError('');
      setMessage('');
      const newNote = await createNote({ ...note, userId });
      setNotes((current) => [newNote, ...current]);
      setMessage('Note ajoutée.');
      return true;
    } catch (err) {
      setError(getFriendlyError(err));
      return false;
    }
  }

  async function saveNote(note) {
    try {
      setError('');
      setMessage('');
      const savedNote = await updateNote(note);
      setNotes((current) => current.map((item) => (item.id === savedNote.id ? savedNote : item)));
      setMessage('Note enregistrée.');
      return true;
    } catch (err) {
      setError(getFriendlyError(err));
      return false;
    }
  }

  async function removeNote(id) {
    try {
      setError('');
      setMessage('');
      await deleteNote(id);
      setNotes((current) => current.filter((item) => item.id !== id));
      setMessage('Note supprimée.');
    } catch (err) {
      setError(getFriendlyError(err));
    }
  }

  return { notes, loading, message, error, addNote, saveNote, removeNote };
}
