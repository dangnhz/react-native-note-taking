import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');
  const { colors, isDark } = useTheme();

  const handleAddTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && tags.length < 3 && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput]);
      setInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <View 
            key={tag} 
            style={[
              styles.tag,
              {
                backgroundColor: isDark 
                  ? `${colors.primary}20`
                  : `${colors.primary}15`,
                borderWidth: 1,
                borderColor: isDark
                  ? `${colors.primary}30`
                  : `${colors.primary}25`,
              }
            ]}
          >
            <Text style={[styles.tagText, { color: colors.primary }]}>
              #{tag}
            </Text>
            <TouchableOpacity 
              onPress={() => handleRemoveTag(tag)}
              style={styles.removeButton}
            >
              <Ionicons 
                name="close-circle" 
                size={16} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {tags.length < 3 && (
        <View style={styles.inputContainer}>
          <View style={[
            styles.inputWrapper,
            { 
              backgroundColor: isDark ? colors.surfaceHover : colors.surface,
              borderColor: colors.border,
            }
          ]}>
            <Ionicons 
              name="pricetag-outline" 
              size={20} 
              color={colors.textTertiary} 
            />
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleAddTag}
              placeholder="Add tag (max 3)"
              style={[styles.input, { color: colors.text }]}
              placeholderTextColor={colors.textTertiary}
              returnKeyType="done"
            />
            {input.trim() && (
              <TouchableOpacity
                onPress={handleAddTag}
                style={[styles.addButton, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  inputContainer: {
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 