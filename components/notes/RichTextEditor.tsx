import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { RichEditor as BaseRichEditor, RichEditorProps } from 'react-native-pell-rich-editor';

type CustomRichEditorProps = RichEditorProps;

const RichTextEditor = forwardRef<BaseRichEditor, CustomRichEditorProps>((props, ref) => {
  const editorRef = useRef<BaseRichEditor>(null);

  useImperativeHandle(ref, () => editorRef.current!);

  return (
    <BaseRichEditor
      {...props}
      ref={editorRef}
      useContainer={Platform.OS === 'ios'}
      initialHeight={400}
      style={[styles.editor, props.style]}
      placeholder="Start writing..."
      initialContentHTML=""
    />
  );
});

const styles = StyleSheet.create({
  editor: {
    flex: 1,
    borderRadius: 8,
  },
});

export default RichTextEditor; 