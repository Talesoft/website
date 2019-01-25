
import React, {Children, createRef, ReactNode, useEffect} from 'react';
import {edit} from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/plain_text';
import 'brace/theme/xcode';

export interface CodeEditorProps
{
    language?: 'plain_text'|'javascript'|'html'|'css';
    readOnly?: boolean;
    onChange?: (value: string) => void;
    children?: ReactNode;
}

export default function CodeEditor({language, readOnly = false, children = '', onChange}: CodeEditorProps)
{
    const divRef = createRef<HTMLDivElement>();
    useEffect(() =>
    {
        if (!divRef.current) {
            return;
        }

        const editor = edit(divRef.current);
        editor.getSession().setMode(`ace/mode/${language}`);
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setUseWorker(false);
        editor.getSession().setUseSoftTabs(true);
        editor.$blockScrolling = Infinity;
        editor.setReadOnly(readOnly);
        editor.setFontSize('16px');
        editor.setValue(Children.toArray(children).filter(child => typeof child === 'string').join('\n'));
        editor.navigateFileStart();
        editor.on('change', () => onChange && editor && onChange(editor.getValue()));

        return () => editor.destroy();
    }, [divRef.current]);

    return <div className="CodeEditor" ref={divRef} />;
}