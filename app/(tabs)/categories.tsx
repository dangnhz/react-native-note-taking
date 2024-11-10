import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import useNoteStore from '../../hooks/useNoteStore';
import { Note } from '../../types';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const PADDING = 16;

// Helper function to strip HTML tags and decode entities
const stripHtml = (html: string) => {
  if (!html) return '';
  
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  const withoutEntities = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Normalize whitespace
  return withoutEntities
    .replace(/\s+/g, ' ')
    .trim();
};

export default function CategoriesScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const notes = useNoteStore((state) => state.notes);
  
  // Get unique tags and their stats
  const tagStats = notes.reduce((acc, note) => {
    note.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = {
          count: 0,
          lastUpdated: new Date(0),
          notes: [],
        };
      }
      acc[tag].count += 1;
      acc[tag].notes.push(note);
      const noteDate = new Date(note.updatedAt);
      if (noteDate > acc[tag].lastUpdated) {
        acc[tag].lastUpdated = noteDate;
      }
    });
    return acc;
  }, {} as Record<string, { count: number; lastUpdated: Date; notes: Note[] }>);

  // Sort tags by count and last updated
  const sortedTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    });

  const renderNotePreview = (note: Note) => {
    const plainContent = stripHtml(note.content);
    const previewText = plainContent.length > 60 
      ? `${plainContent.slice(0, 60)}...` 
      : plainContent;

    return (
      <TouchableOpacity
        key={note.id}
        style={[
          styles.notePreview,
          { backgroundColor: colors.surfaceHover }
        ]}
        onPress={() => router.push(`/note/${note.id}`)}
      >
        <Text 
          numberOfLines={1}
          style={[styles.noteTitle, { color: colors.text }]}
        >
          {note.title}
        </Text>
        <Text 
          numberOfLines={2}
          style={[styles.notePreviewText, { color: colors.textSecondary }]}
        >
          {previewText}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {sortedTags.length === 0 ? (
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
          data={sortedTags}
          renderItem={({ item: [tag, stats] }) => (
            <View style={[
              styles.categoryCard,
              { backgroundColor: colors.surface }
            ]}>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <View style={[
                  styles.tagBadge,
                  { backgroundColor: isDark ? `${colors.primary}15` : `${colors.primary}10` }
                ]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    #{tag}
                  </Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.countText}>
                      {stats.count}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Notes Grid */}
              <View style={styles.notesGrid}>
                {stats.notes
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 3)
                  .map(renderNotePreview)}
              </View>

              {/* Show More Button */}
              {stats.notes.length > 3 && (
                <TouchableOpacity
                  style={[styles.showMoreButton, { backgroundColor: colors.surfaceHover }]}
                  onPress={() => {
                    router.push({
                      pathname: '/search',
                      params: { tag }
                    });
                  }}
                >
                  <Text style={[styles.showMoreText, { color: colors.primary }]}>
                    View all {stats.count} notes
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={([tag]) => tag}
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
    gap: 16,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tagText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesGrid: {
    gap: 8,
  },
  notePreview: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  notePreviewText: {
    fontSize: 13,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
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