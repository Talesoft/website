
import CircularColor from 'react-circular-color';
import React from 'react';

export interface ColorPickerProps
{
    color?: string;
    onChange?: (color: string) => void;
}

export default function ColorPicker({color, onChange}: ColorPickerProps)
{
    return <CircularColor color={color} onChange={onChange} />;
}