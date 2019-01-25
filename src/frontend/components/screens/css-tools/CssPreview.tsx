
import React, {useState} from 'react';
import CodeEditor from "../../form-controls/CodeEditor";
import AlphaColorSlider from "../../form-controls/AlphaColorSlider";
import {getHashCode} from "../../../possible-future-libraries/react-utils/index";

export interface CssPreviewProps
{
    css: string;
}

export type CssPreviewElementStyle = 'rectangle'|'square'|'circle';

export default function CssPreview({css}: CssPreviewProps)
{
    const [color, setColor] = useState('#f00');
    const hash = getHashCode(css);
    return <div className="CssPreview">
        <style>
            {`.css-preview-${hash} {\n${css}\n}`}
        </style>
        <div className="CssPreview__element-container">
            <div className="CssPreview__element" />
        </div>
        <div className="CssPreview__options">
            <AlphaColorSlider color={color} onChange={color => setColor(color)}/>
        </div>
        <div className="CssPreview__code-editor">
            <CodeEditor language="css" readOnly>
                {css}
            </CodeEditor>
        </div>
    </div>
}