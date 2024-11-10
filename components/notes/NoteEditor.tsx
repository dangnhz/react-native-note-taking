import { SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { RichToolbar, actions } from 'react-native-pell-rich-editor';
import { Ionicons } from '@expo/vector-icons';
import TagInput from './TagInput';
import useTheme from '../../hooks/useTheme';
import { TextInput } from 'react-native';
import { useRef, useCallback } from 'react';
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

	const handleContentChange = (html: string) => {
		if (onContentChange) {
			onContentChange(html);
		}
	};

	const handleCursorPosition = useCallback((scrollY: number) => {
		if (scrollY < 30) return;

		scrollRef.current?.scrollTo({
			y: Math.max(0, scrollY - 150),
			animated: true,
		});
	}, []);

	const handlePressAddImage = () => {
		richTextRef.current?.insertImage('https://example.com/image.jpg');
	};

	return (
		<SafeAreaView style={styles.container}>
			<TextInput value={title} onChangeText={onTitleChange} placeholder="Note Title" style={[styles.titleInput, { color: colors.text }]} placeholderTextColor={colors.textTertiary} />
			<TagInput tags={tags} onChange={onTagsChange} />
			<RichToolbar
				editor={richTextRef}
				selectedIconTint={colors.primary}
				iconTint={colors.text}
				actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.setStrikethrough, actions.insertBulletsList, actions.insertOrderedList, actions.checkboxList, actions.insertImage, actions.undo, actions.redo]}
				iconMap={{
					[actions.undo]: () => <Ionicons name="arrow-undo" size={20} color={colors.text} />,
					[actions.redo]: () => <Ionicons name="arrow-redo" size={20} color={colors.text} />,
					[actions.insertImage]: () => <Ionicons name="image-outline" size={20} color={colors.text} />,
				}}
				style={[styles.toolbar, { backgroundColor: colors.card }]}
				onPressAddImage={handlePressAddImage}
			/>

			<ScrollView ref={scrollRef} style={styles.scroll} keyboardDismissMode="none" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} scrollEventThrottle={16} contentContainerStyle={styles.scrollContent}>
				<RichTextEditor
					ref={richTextRef}
					initialContentHTML={content}
					onChange={handleContentChange}
					onCursorPosition={handleCursorPosition}
					placeholder="Start writing..."
					editorStyle={{
						backgroundColor: 'transparent',
						placeholderColor: colors.textTertiary,
						color: colors.text,
						cssText: `
							padding: 12px;
							font-size: 16px;
							min-height: 300px;
						`,
					}}
					style={styles.editor}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
		gap: 16,
	},
	titleInput: {
		fontSize: 24,
		fontWeight: 'bold',
		paddingVertical: 8,
	},
	toolbar: {
		borderRadius: 8,
		marginBottom: 8,
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 32,
	},
	editor: {
		flex: 1,
		borderRadius: 8,
		minHeight: 300,
	},
});
