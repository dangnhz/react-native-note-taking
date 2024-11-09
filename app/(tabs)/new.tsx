import { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useNoteStore from '../../hooks/useNoteStore';
import NoteEditor from '../../components/notes/NoteEditor';
import { NoteStore } from '../../types';
import useTheme from '../../hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';

export default function NewNoteScreen() {
	const router = useRouter();
	const addNote = useNoteStore((state: NoteStore) => state.addNote);
	const { colors } = useTheme();

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState<string[]>([]);

	// Clear form when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			setTitle('');
			setContent('');
			setTags([]);
		}, [])
	);

	const handleSave = () => {
		if (!title.trim()) return;

		addNote({
			title,
			content,
			tags,
			isFavorite: false,
		});

		// Navigate back to the notes tab
		router.replace('/(tabs)');
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.surface }]}>
			<ScrollView style={styles.scrollView}>
				<NoteEditor title={title} content={content} tags={tags} onTitleChange={setTitle} onContentChange={setContent} onTagsChange={setTags} />
			</ScrollView>
			<TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: colors.primary }]}>
				<Ionicons name="checkmark" size={24} color="white" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
		padding: 16,
	},
	saveButton: {
		position: 'absolute',
		bottom: 24,
		right: 24,
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
});
