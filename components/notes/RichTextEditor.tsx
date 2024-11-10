import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { RichEditor as BaseRichEditor, RichEditorProps } from 'react-native-pell-rich-editor';

interface CustomRichEditorProps extends RichEditorProps {
  onChange?: (text: string) => void;
}

const RichTextEditor = forwardRef<BaseRichEditor, CustomRichEditorProps>((props, ref) => {
  const editorRef = useRef<BaseRichEditor>(null);

  useImperativeHandle(ref, () => editorRef.current!);

  // Reset content when initialContentHTML changes to empty
  useEffect(() => {
    if (props.initialContentHTML === '') {
      editorRef.current?.setContentHTML('');
    }
  }, [props.initialContentHTML]);

  const handleChange = (html: string) => {
    if (props.onChange) {
      props.onChange(html);
    }
  };

  return (
    <BaseRichEditor
      {...props}
      ref={editorRef}
      useContainer={Platform.OS === 'ios'}
      initialHeight={400}
      style={[styles.editor, props.style]}
      placeholder="Start writing..."
      onChange={handleChange}
      initialContentHTML={props.initialContentHTML || ""}
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