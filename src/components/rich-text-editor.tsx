
"use client";

import React, { useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import type Quill from 'quill';
import type { ReactQuillProps } from 'react-quill';
import { cn } from '@/lib/utils';

interface RichTextEditorProps extends Omit<ReactQuillProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor = (props: RichTextEditorProps) => {
    const { value, onChange, className, ...rest } = props;
    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const isUpdating = useRef(false);

    useEffect(() => {
        let quill: Quill | null = null;
        
        const initializeQuill = async () => {
            if (editorRef.current && !quillRef.current) {
                const { default: ReactQuill } = await import('react-quill');
                const { default: Quill } = await import('quill');
                
                const editor = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                            ['link'],
                            ['clean']
                        ],
                    },
                    ...rest
                });

                quillRef.current = editor;
                quill = editor;
                
                if (quill) {
                    quill.on('text-change', (delta, oldDelta, source) => {
                        if (source === 'user') {
                            isUpdating.current = true;
                            const html = quill?.root.innerHTML || '';
                            onChange(html === '<p><br></p>' ? '' : html);
                        }
                    });

                    // Set initial value
                    if (value) {
                         const delta = quill.clipboard.convert(value as any);
                         quill.setContents(delta, 'silent');
                    }
                }
            }
        };

        if (typeof window !== 'undefined') {
            initializeQuill();
        }

        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rest]);


    useEffect(() => {
        if (quillRef.current && quillRef.current.root.innerHTML !== value && !isUpdating.current) {
             const delta = quillRef.current.clipboard.convert(value as any);
             quillRef.current.setContents(delta, 'silent');
        }
        if (isUpdating.current) {
            isUpdating.current = false;
        }
    }, [value]);

    if (typeof window === 'undefined') {
        return null;
    }
    
    return (
        <div className={cn("quill-editor-container", className)}>
            <div ref={editorRef} style={{minHeight: '250px'}}></div>
        </div>
    );
};
