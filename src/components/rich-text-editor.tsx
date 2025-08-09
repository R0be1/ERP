
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
        if (!isClient || !editorRef.current) return;

        let quillInstance: Quill | null = null;
        
        const initializeQuill = async () => {
            if (editorRef.current && !quillRef.current) {
                const { default: Quill } = await import('quill');
                
                const Parchment = Quill.import('parchment');

                // Add Font Size
                const sizeStyle = Quill.import('attributors/style/size');
                sizeStyle.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '36px', 'small', 'large', 'huge'];
                Quill.register(sizeStyle, true);
                
                // Add Font Family
                const fontStyle = Quill.import('attributors/style/font');
                fontStyle.whitelist = ['arial', 'times-new-roman', 'verdana', 'courier-new', 'georgia', 'comic-sans-ms'];
                Quill.register(fontStyle, true);

                // Add line height
                const lineHeightConfig = {
                    scope: Parchment.Scope.BLOCK,
                    whitelist: ['1', '1.5', '2', '2.5', '3']
                };
                const LineHeightStyle = new Parchment.Attributor.Style('line-height', 'line-height', lineHeightConfig);
                Quill.register(LineHeightStyle, true);
                
                quillInstance = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                         toolbar: [
                          [{ 'font': ['arial', 'times-new-roman', 'verdana', 'courier-new', 'georgia', 'comic-sans-ms'] }],
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          [{ 'size': ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '36px', 'small', false, 'large', 'huge'] }],
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
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
             const delta = quillRef.current.clipboard.convert(value as any);
             quillRef.current.setContents(delta, 'silent');
        }
    }, [value]);

    if (!isClient) {
        return <div className={cn("quill-editor-container", className)} style={{minHeight: '250px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: 'var(--radius)'}}></div>;
    }
    
    return (
        <div className={cn("quill-editor-container", className)}>
            <style jsx global>{`
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
                    content: 'Arial';
                    font-family: 'Arial', sans-serif;
                }
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
                    content: 'Times New Roman';
                    font-family: 'Times New Roman', serif;
                }
                .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
                    content: 'Verdana';
                    font-family: 'Verdana', sans-serif;
                }
                 .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
                    content: 'Courier New';
                    font-family: 'Courier New', monospace;
                }
                 .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
                    content: 'Georgia';
                    font-family: 'Georgia', serif;
                }
                 .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="comic-sans-ms"]::before,
                .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="comic-sans-ms"]::before {
                    content: 'Comic Sans MS';
                    font-family: 'Comic Sans MS', cursive;
                }
                .ql-picker.ql-size .ql-picker-label[data-value="8px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="8px"]::before {
                  content: "8";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
                  content: "10";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
                  content: "12";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
                  content: "14";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
                  content: "16";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
                  content: "18";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
                  content: "24";
                }
                .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
                .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
                  content: "36";
                }
            `}</style>
            <div ref={editorRef} style={{minHeight: '250px'}}></div>
        </div>
    );
};
