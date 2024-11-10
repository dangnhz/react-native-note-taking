import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { RichEditor as BaseRichEditor, RichEditorProps, actions } from 'react-native-pell-rich-editor';

interface CustomRichEditorProps extends RichEditorProps {
  onChange?: (text: string) => void;
}

export interface RichEditorHandle {
  insertHTML: (html: string) => void;
  setContentHTML: (html: string) => void;
  getContentHtml: () => Promise<string>;
  registerToolbar: (callback: (items: any) => void) => void;
  sendAction: (type: string, action: string, data?: any) => void;
}

const RichTextEditor = forwardRef<RichEditorHandle, CustomRichEditorProps>((props, ref) => {
  const editorRef = useRef<BaseRichEditor>(null);

  useImperativeHandle(ref, () => ({
    insertHTML: (html: string) => {
      editorRef.current?.insertHTML(html);
    },
    setContentHTML: (html: string) => {
      editorRef.current?.setContentHTML(html);
    },
    getContentHtml: async () => {
      return editorRef.current?.getContentHtml() || '';
    },
    registerToolbar: (callback) => {
      editorRef.current?.registerToolbar(callback);
    },
    sendAction: (type, action, data) => {
      editorRef.current?.sendAction(type, action, data);
    }
  }));

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

  const customCSS = `
    img {
      max-width: 100% !important;
      height: auto !important;
      margin: 10px 0;
    }
  `;

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
      editorStyle={{
        ...props.editorStyle,
        cssText: `
          ${props.editorStyle?.cssText || ''}
          ${customCSS}
        `
      }}
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