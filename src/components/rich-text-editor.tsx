
"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { forwardRef } from 'react';

// Using dynamic import for react-quill to avoid SSR issues.
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // The ref is forwarded to the underlying Quill instance.
    return function ReactQuillHOC({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);


const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'clean'
];

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = forwardRef((props: RichTextEditorProps, ref) => {
    return (
        <div className={props.className}>
            <ReactQuill
                forwardedRef={ref}
                theme="snow"
                value={props.value}
                onChange={props.onChange}
                modules={modules}
                formats={formats}
                placeholder={props.placeholder}
            />
        </div>
    );
});

RichTextEditor.displayName = 'RichTextEditor';
