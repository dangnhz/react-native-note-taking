import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import useNoteStore from '../../hooks/useNoteStore';

interface CategoryPickerProps {
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
}

export default function CategoryPicker({ selectedTags, onSelectTag }: CategoryPickerProps) {
  const notes = useNoteStore((state) => state.notes);
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allTags.map(tag => (
        <TouchableOpacity
          key={tag}
          style={[
            styles.tag,
            selectedTags.includes(tag) && styles.selectedTag
          ]}
          onPress={() => onSelectTag(tag)}
        >
          <Text style={[
            styles.tagText,
            selectedTags.includes(tag) && styles.selectedTagText
          ]}>
            #{tag}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedTag: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
  selectedTagText: {
    color: 'white',
  },
}); 