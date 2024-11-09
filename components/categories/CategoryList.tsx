import { View, Text, StyleSheet, FlatList } from 'react-native';
import useNoteStore from '../../hooks/useNoteStore';
import NoteCard from '../notes/NoteCard';
import { Note } from '../../types';

interface CategoryListProps {
  tag: string;
}

export default function CategoryList({ tag }: CategoryListProps) {
  const notes = useNoteStore((state) => 
    state.notes.filter((note: Note) => note.tags.includes(tag))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>#{tag}</Text>
      <FlatList
        data={notes}
        renderItem={({ item }) => <NoteCard note={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#007AFF',
    paddingHorizontal: 16,
  },
  list: {
    padding: 16,
    gap: 16,
  },
}); 