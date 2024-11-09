import { View, FlatList, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useNoteStore from '../../hooks/useNoteStore';
import NoteCard from '../../components/notes/NoteCard';
import { Note, NoteStore } from '../../types';
import useTheme from '../../hooks/useTheme';

export default function NotesScreen() {
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();
	const notes = useNoteStore((state: NoteStore) => state.notes);

	// Calculate bottom padding for FAB
	const TAB_BAR_HEIGHT = Platform.select({
		ios: 49 + insets.bottom,
		android: 56,
		default: 56,
	});

	const FAB_BOTTOM = Platform.select({
		ios: insets.bottom + 70,
		android: 90,
		default: 90,
	});

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<FlatList
				data={notes}
				renderItem={({ item }) => <NoteCard note={item} />}
				keyExtractor={(item: Note) => item.id}
				contentContainerStyle={[styles.listContent, { paddingBottom: TAB_BAR_HEIGHT + 20 }]}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notes yet</Text>
						<Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Tap the + button to create your first note</Text>
					</View>
				}
			/>
			<View style={[styles.fabWrapper, { bottom: FAB_BOTTOM }]}>
				<Link href="/note/new" asChild>
					<TouchableOpacity>
						<View style={[styles.fab, { backgroundColor: colors.primary }]}>
							<Ionicons name="add" size={30} color={colors.surface} />
						</View>
					</TouchableOpacity>
				</Link>
			</View>
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
	fabWrapper: {
		position: 'absolute',
		right: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 10,
	},
	fab: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
