import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoteStore } from '../types';

const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({
        notes: [...state.notes, {
          ...note,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
      })),
      updateNote: (id, updatedNote) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, ...updatedNote, updatedAt: new Date() }
            : note
        ),
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      })),
      toggleFavorite: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, isFavorite: !note.isFavorite }
            : note
        ),
      })),
      updateNotes: (notes) => set({ notes }),
    }),
    {
      name: 'note-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useNoteStore; 