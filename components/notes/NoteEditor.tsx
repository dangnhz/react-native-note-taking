import { SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Ionicons } from '@expo/vector-icons';
import TagInput from './TagInput';
import useTheme from '../../hooks/useTheme';
import { TextInput } from 'react-native';
import { useRef } from 'react';
import RichTextEditor from './RichTextEditor';

interface NoteEditorProps {
	title: string;
	content: string;
	tags: string[];
	onTitleChange: (text: string) => void;
	onContentChange: (text: string) => void;
	onTagsChange: (tags: string[]) => void;
}

export default function NoteEditor({ title, content, tags, onTitleChange, onContentChange, onTagsChange }: NoteEditorProps) {
	const { colors } = useTheme();
	const richTextRef = useRef<any>(null);
	const scrollRef = useRef<ScrollView>(null);

	const handleCursorPosition = (scrollY: number) => {
		// Scroll to cursor position with offset
		scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
	};

	const handlePressAddImage = () => {
		// You can implement image picker here
		richTextRef.current?.insertImage('https://example.com/image.jpg');
	};

	return (
		<SafeAreaView style={styles.container}>
			<TextInput
				value={title}
				onChangeText={onTitleChange}
				placeholder="Note Title"
				style={[styles.titleInput, { color: colors.text }]}
				placeholderTextColor={colors.textTertiary}
			/>
			<TagInput tags={tags} onChange={onTagsChange} />
			<RichToolbar
				editor={richTextRef}
				selectedIconTint={colors.primary}
				iconTint={colors.text}
				actions={[
					actions.setBold,
					actions.setItalic,
					actions.setUnderline,
					actions.setStrikethrough,
					actions.insertBulletsList,
					actions.insertOrderedList,
					actions.checkboxList,
					actions.insertImage,
					actions.undo,
					actions.redo,
				]}
				iconMap={{
					[actions.undo]: () => <Ionicons name="arrow-undo" size={20} color={colors.text} />,
					[actions.redo]: () => <Ionicons name="arrow-redo" size={20} color={colors.text} />,
					[actions.insertImage]: () => <Ionicons name="image-outline" size={20} color={colors.text} />,
				}}
				style={[styles.toolbar, { backgroundColor: colors.card }]}
				onPressAddImage={handlePressAddImage}
			/>
			
			<KeyboardAvoidingView 
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
				style={styles.editorContainer}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
			>
				<ScrollView
					ref={scrollRef}
					style={styles.scroll}
					keyboardDismissMode="interactive"
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={true}
				>
					<RichTextEditor
						ref={richTextRef}
						initialContentHTML={content}
						onChange={onContentChange}
						onCursorPosition={handleCursorPosition}
						placeholder="Start writing..."
						editorStyle={{
							backgroundColor: 'transparent',
							placeholderColor: colors.textTertiary,
							color: colors.text,
							cssText: 'padding: 8px;',
						}}
							style={styles.editor}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
	toolbar: {
		borderRadius: 8,
	},
	editorContainer: {
		flex: 1,
	},
	scroll: {
		flex: 1,
	},
	editor: {
		flex: 1,
		borderRadius: 8,
		minHeight: 200,
	},
});
