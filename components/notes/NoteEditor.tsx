import { View, TextInput, StyleSheet } from 'react-native';
import TagInput from './TagInput';
import useTheme from '../../hooks/useTheme';

interface NoteEditorProps {
  title: string;
  content: string;
  tags: string[];
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onTagsChange: (tags: string[]) => void;
}

export default function NoteEditor({
  title,
  content,
  tags,
  onTitleChange,
  onContentChange,
  onTagsChange,
}: NoteEditorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Note Title"
        style={[styles.titleInput, { color: colors.text }]}
        placeholderTextColor={colors.textTertiary}
      />
      <TagInput 
        tags={tags} 
        onChange={onTagsChange}
      />
      <TextInput
        value={content}
        onChangeText={onContentChange}
        placeholder="Start writing..."
        style={[styles.contentInput, { color: colors.text }]}
        multiline
        placeholderTextColor={colors.textTertiary}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
}); 