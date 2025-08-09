
"use client";

import React, { useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import type Quill from 'quill';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  [key: string]: any; // Allow other props
}

export const RichTextEditor = (props: RichTextEditorProps) => {
    const { value, onChange, className, ...rest } = props;
    const quillRef = useRef<Quill | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        let quillInstance: Quill | null = null;
        
        const initializeQuill = async () => {
            if (editorRef.current && !quillRef.current) {
                const { default: Quill } = await import('quill');
                
                // Add line height to formats
                const Size = Quill.import('attributors/style/size');
                Quill.register(Size, true);

                const LineHeight = Quill.import('attributors/style/line-height');
                LineHeight.whitelist = ['1', '1.5', '2', '2.5', '3'];
                Quill.register(LineHeight, true);
                
                quillInstance = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                         toolbar: [
                          [{ 'font': [] }],
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          [{ 'size': ['small', false, 'large', 'huge'] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          ['blockquote', 'code-block'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          [{ 'direction': 'rtl' }, { 'align': [] }],
                          [{ 'line-height': ['1', '1.5', '2', '2.5', '3'] }],
                          ['link', 'image', 'video'],
                          ['clean']
                        ],
                    },
                    ...rest
                });

                quillRef.current = quillInstance;
                
                if (quillInstance) {
                    if (value) {
                         const delta = quillInstance.clipboard.convert(value as any);
                         quillInstance.setContents(delta, 'silent');
                    }

                    quillInstance.on('text-change', (delta, oldDelta, source) => {
                        if (source === 'user') {
                            const html = quillInstance?.root.innerHTML || '';
                            if (html !== value) {
                                onChange(html === '<p><br></p>' ? '' : html);
                            }
                        }
                    });
                }
            }
        };
        
        if (isClient) {
            initializeQuill();
        }

        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change');
                quillRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClient]);


    useEffect(() => {
        if (quillRef.current && quillRef.current.root.innerHTML !== value) {
             const delta = quillRef.current.clipboard.convert(value as any);
             quillRef.current.setContents(delta, 'silent');
        }
    }, [value]);

    if (!isClient) {
        return <div className={cn("quill-editor-container", className)} style={{minHeight: '250px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: 'var(--radius)'}}></div>;
    }
    
    return (
        <div className={cn("quill-editor-container", className)}>
            <div ref={editorRef} style={{minHeight: '250px'}}></div>
        </div>
    );
};
