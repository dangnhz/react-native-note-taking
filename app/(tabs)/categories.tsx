import { View, Text, FlatList, StyleSheet } from 'react-native';
import useNoteStore from '../../hooks/useNoteStore';
import NoteCard from '../../components/notes/NoteCard';
import { Note } from '../../types';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const PADDING = 16;

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const notes = useNoteStore((state) => state.notes);
  
  // Get unique tags from all notes
  const tags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {tags.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No categories yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Add tags to your notes to organize them
          </Text>
        </View>
      ) : (
        <FlatList
          data={tags}
          renderItem={({ item: tag }) => (
            <View style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.primary }]}>
                #{tag}
              </Text>
              <FlatList
                data={notes.filter((note: Note) => note.tags.includes(tag))}
                renderItem={({ item }) => (
                  <View style={styles.cardContainer}>
                    <NoteCard note={item} />
                  </View>
                )}
                keyExtractor={(item: Note) => item.id}
                contentContainerStyle={styles.notesList}
                scrollEnabled={false} // Disable scrolling for inner list
              />
            </View>
          )}
          keyExtractor={(item: string) => item}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: PADDING,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  notesList: {
    gap: 12,
  },
  cardContainer: {
    width: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
}); 