// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// TODO: Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}
// remove the eslint disable when you implement on save
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  // remove the eslint disable when you implement the state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO: create state for saving status
  // TODO: createState for error handling
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    }
  }, [initialNote]);

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNote((prev) => ({
      ...prev,
      [name]: value,
      lastUpdated: Date.now(),
    }));
  };

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveNote(note);
      if (onSave) onSave(note);
      if (!initialNote) {
        setNote({
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        });
      }
    } catch (err) {
      setError('Failed to save note.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note
  return (
    <>
      <form className="note-editor" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
            disabled={saving}
            required
            placeholder="Enter note title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={note.content}
            onChange={handleChange}
            disabled={saving}
            rows={5}
            required
            placeholder="Enter note content"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default NoteEditor;
