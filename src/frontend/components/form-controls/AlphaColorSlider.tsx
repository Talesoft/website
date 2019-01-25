
import './AlphaColorSlider.scss';
import React from 'react';
import RangeSlider from "./RangeSlider";
import Color from "../../possible-future-libraries/color/Color";
import {classes, getHashCode} from "../../possible-future-libraries/react-utils/index";

export interface AlphaColorProps
{
    color: string;
    onChange: (color: string) => void;
}

export default function AlphaColorSlider({color, onChange}: AlphaColorProps)
{
    const colorInstance = Color.fromString(color);
    const opaqueColor = colorInstance.rgbString;
    const transparentColor = colorInstance.clone(color => color.alpha = 0).rgbaString;
    const css = `background: linear-gradient(to right, ${transparentColor} 0%, ${opaqueColor} 100%);`;
    const hash = getHashCode(color);
    const gradientStyle = `
         .AlphaColorSlider--${hash}::-webkit-slider-runnable-track {${css}}
         .AlphaColorSlider--${hash}::-moz-range-track {${css}}
         .AlphaColorSlider--${hash}::-ms-fill-upper {${css}}
    `;
    return <>
        <style>{gradientStyle}</style>
        <RangeSlider
            className={classes('AlphaColorSlider', `AlphaColorSlider--${hash}`)}
            min={0}
            max={100}
            step={1}
            value={(colorInstance.alpha * 100).toFixed(0)}
            onChange={event =>
            {
                const value = parseInt(event.currentTarget.value);
                colorInstance.alpha = value / 100;
                onChange(colorInstance.toString());
            }}
        />
    </>;
}