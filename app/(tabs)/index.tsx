import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useNoteStore from '../../hooks/useNoteStore';
import NoteCard from '../../components/notes/NoteCard';
import { Note, NoteStore } from '../../types';
import useTheme from '../../hooks/useTheme';

export default function NotesScreen() {
	const { colors } = useTheme();
	const notes = useNoteStore((state: NoteStore) => state.notes);

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<FlatList
				data={notes}
				renderItem={({ item }) => <NoteCard note={item} />}
				keyExtractor={(item: Note) => item.id}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							No notes yet
						</Text>
						<Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
							Tap the + button to create your first note
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
	listContent: {
		padding: 16,
		gap: 16,
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 100,
		gap: 12,
	},
	emptyText: {
		fontSize: 20,
		fontWeight: '600',
	},
	emptySubtext: {
		fontSize: 16,
		textAlign: 'center',
	},
});
