// src/components/NoteList.tsx
import React from 'react';
import { useEffect, useState } from 'react';

// TODO: import { subscribeToNotes } from '../services/noteService';
import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore
  const [notes, setNotes] = useState<Notes>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToNotes(
        (newNotes) => {
          setNotes(newNotes);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError('Failed to load notes');
          setLoading(false);
        },
      );
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setError('Failed to load notes');
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {Object.values(notes).length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {Object.values(notes)
            // Sort by lastUpdated (most recent first)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
