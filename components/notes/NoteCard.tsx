import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Note, NoteStore } from '../../types';
import useNoteStore from '../../hooks/useNoteStore';
import useTheme from '../../hooks/useTheme';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { colors, isDark } = useTheme();
  const toggleFavorite = useNoteStore((state: NoteStore) => state.toggleFavorite);

  // Function to strip HTML tags and decode HTML entities
  const stripHtml = (html: string) => {
    if (!html) return '';
    
    // First, remove HTML tags
    const withoutTags = html.replace(/<[^>]*>/g, ' ');
    
    // Then, decode HTML entities
    const withoutEntities = withoutTags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Finally, normalize whitespace
    return withoutEntities
      .replace(/\s+/g, ' ')
      .trim();
  };

  const previewLength = note.title.length > 30 ? 80 : 120;
  const plainTextContent = stripHtml(note.content);
  const previewText = plainTextContent.length > previewLength 
    ? `${plainTextContent.slice(0, previewLength)}...` 
    : plainTextContent;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.card,
      }
    ]}>
      <Link href={`/note/${note.id}`} asChild>
        <TouchableOpacity 
          style={styles.touchable}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text 
                  style={[styles.title, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {note.title}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.favoriteButton,
                    { backgroundColor: note.isFavorite ? `${colors.warning}20` : 'transparent' }
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(note.id);
                  }}
                >
                  <Ionicons
                    name={note.isFavorite ? 'star' : 'star-outline'}
                    size={22}
                    color={note.isFavorite ? colors.warning : colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.date, { color: colors.textTertiary }]}>
                {format(new Date(note.updatedAt), 'MMM d, yyyy')}
              </Text>
            </View>

            {/* Content Preview */}
            <Text 
              numberOfLines={3} 
              style={[styles.content, { color: colors.textSecondary }]}
            >
              {previewText}
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
              {/* Tags */}
              <View style={styles.tagsContainer}>
                {note.tags.slice(0, 2).map((tag) => (
                  <View 
                    key={tag} 
                    style={[
                      styles.tag, 
                      { backgroundColor: isDark ? `${colors.primary}20` : `${colors.primary}15` }
                    ]}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
                {note.tags.length > 2 && (
                  <View style={[styles.moreTag, { backgroundColor: colors.surfaceHover }]}>
                    <Text style={[styles.moreTagText, { color: colors.textSecondary }]}>
                      +{note.tags.length - 2}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  touchable: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  header: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    lineHeight: 26,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  moreTag: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moreTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  wordCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  wordCountText: {
    fontSize: 14,
    fontWeight: '500',
  },
});