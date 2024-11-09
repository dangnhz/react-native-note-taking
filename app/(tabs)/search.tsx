import React from 'react';
import { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useNoteStore from '../../hooks/useNoteStore';
import NoteCard from '../../components/notes/NoteCard';
import { Note, NoteStore } from '../../types';
import useTheme from '../../hooks/useTheme';

type FilterOption = 'all' | 'favorites' | 'recent' | 'tagged';
type SortOption = 'newest' | 'oldest' | 'title' | 'updated';

const { width } = Dimensions.get('window');
const PADDING = 16;
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - PADDING * 2 - CARD_MARGIN * 2) / 2;

export default function SearchScreen() {
  const { colors } = useTheme();
  const notes = useNoteStore((state: NoteStore) => state.notes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from all notes
  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap(note => note.tags))).sort();
  }, [notes]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = [...notes];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(note => note.isFavorite);
        break;
      case 'recent':
        filtered = filtered.filter(note => {
          const noteDate = new Date(note.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return noteDate >= weekAgo;
        });
        break;
      case 'tagged':
        if (selectedTag) {
          filtered = filtered.filter(note => note.tags.includes(selectedTag));
        }
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  }, [notes, searchQuery, filterBy, sortBy, selectedTag]);

  const FilterButton = ({ option, label, icon }: { option: FilterOption; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterBy === option && styles.filterButtonActive,
        { backgroundColor: filterBy === option ? colors.primary : colors.surface }
      ]}
      onPress={() => {
        setFilterBy(option);
        if (option !== 'tagged') setSelectedTag(null);
      }}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={filterBy === option ? 'white' : colors.textSecondary} 
      />
      <Text
        style={[
          styles.filterButtonText,
          { color: filterBy === option ? 'white' : colors.textSecondary }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Add state for dropdown visibility
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'newest', label: 'Newest First', icon: 'time-outline' },
    { value: 'oldest', label: 'Oldest First', icon: 'calendar-outline' },
    { value: 'title', label: 'By Title', icon: 'text-outline' },
    { value: 'updated', label: 'Last Updated', icon: 'refresh-outline' },
  ];

  // Replace the sort button with this new version
  const SortDropdown = () => (
    <>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: colors.surface }]}
        onPress={() => setSortModalVisible(true)}
      >
        <Ionicons name="funnel-outline" size={16} color={colors.primary} />
        <Text style={[styles.sortButtonText, { color: colors.text }]}>
          Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View 
            style={[
              styles.sortModal,
              { backgroundColor: colors.surface }
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Sort Notes</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  sortBy === option.value && styles.sortOptionActive,
                  { backgroundColor: sortBy === option.value ? `${colors.primary}15` : 'transparent' }
                ]}
                onPress={() => {
                  setSortBy(option.value);
                  setSortModalVisible(false);
                }}
              >
                <View style={styles.sortOptionContent}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={20} 
                    color={sortBy === option.value ? colors.primary : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.sortOptionText,
                      { color: sortBy === option.value ? colors.primary : colors.text }
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={24} color={colors.primary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes..."
            style={[styles.input, { color: colors.text }]}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery ? (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <FilterButton option="all" label="All" icon="albums-outline" />
        <FilterButton option="favorites" label="Favorites" icon="star-outline" />
        <FilterButton option="recent" label="Recent" icon="time-outline" />
        <FilterButton option="tagged" label="Tags" icon="pricetags-outline" />
      </View>

      {/* Tag Selection */}
      {filterBy === 'tagged' && (
        <View style={styles.tagContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={allTags}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tagButton,
                  selectedTag === item && styles.tagButtonActive,
                  { backgroundColor: selectedTag === item ? colors.primary : colors.surface }
                ]}
                onPress={() => setSelectedTag(item)}
              >
                <Ionicons 
                  name="pricetag" 
                  size={16} 
                  color={selectedTag === item ? 'white' : colors.primary} 
                />
                <Text
                  style={[
                    styles.tagButtonText,
                    { color: selectedTag === item ? 'white' : colors.text }
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            contentContainerStyle={styles.tagList}
          />
        </View>
      )}

      {/* Sort Button */}
      <SortDropdown />

      {/* Results List */}
      <FlatList
        data={filteredAndSortedNotes}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <NoteCard note={item} />
          </View>
        )}
        keyExtractor={(item: Note) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No notes found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: PADDING,
    paddingBottom: 8,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagContainer: {
    marginBottom: 16,
  },
  tagList: {
    paddingHorizontal: PADDING,
    gap: 8,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tagButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: PADDING,
    marginBottom: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: PADDING,
    gap: 12,
    paddingBottom: 100,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagButtonActive: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: PADDING,
  },
  sortModal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  sortOptionActive: {
    backgroundColor: '#007AFF20',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 