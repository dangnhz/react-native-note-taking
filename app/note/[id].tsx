import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useNoteStore from '../../hooks/useNoteStore';
import NoteEditor from '../../components/notes/NoteEditor';
import { Note } from '../../types';
import useTheme from '../../hooks/useTheme';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  // Ensure id is a string
  const noteId = Array.isArray(id) ? id[0] : id;
  const [note, updateNote, deleteNote] = useNoteStore((state) => [
    state.notes.find((n: Note) => n.id === noteId),
    state.updateNote,
    state.deleteNote,
  ]);

  const [localNote, setLocalNote] = useState<Note | null>(note || null);

  useEffect(() => {
    setLocalNote(note ?? null);
  }, [note]);

  const handleUpdate = useCallback((updatedNote: Note) => {
    if (noteId) {
      // Extract only the fields we want to update
      const { title, content, tags } = updatedNote;
      updateNote(noteId, { title, content, tags });
    }
  }, [noteId, updateNote]);

  const handleTitleChange = (title: string) => {
    setLocalNote(prev => prev ? { ...prev, title } : null);
  };

  const handleContentChange = (content: string) => {
    setLocalNote(prev => prev ? { ...prev, content } : null);
  };

  const handleTagsChange = (tags: string[]) => {
    setLocalNote(prev => prev ? { ...prev, tags } : null);
  };

  useEffect(() => {
    if (localNote) {
      const timeoutId = setTimeout(() => {
        handleUpdate(localNote);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [localNote, handleUpdate]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (noteId) {
              deleteNote(noteId);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!localNote) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View 
        style={[
          styles.content,
          { backgroundColor: isDark ? colors.surface : '#F8F9FA' }
        ]}
      >
        <NoteEditor
          title={localNote.title}
          content={localNote.content}
          tags={localNote.tags}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onTagsChange={handleTagsChange}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={24} color={colors.surface} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="checkmark" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderRadius: 24,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    paddingBottom: 24,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
}); 