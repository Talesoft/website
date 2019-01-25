
import './RangeSlider.scss';
import React, {DetailedHTMLProps, InputHTMLAttributes} from "react";
import {classes} from "../../possible-future-libraries/react-utils/index";

export interface RangeSliderProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
{
}

export default function RangeSlider(props: RangeSliderProps)
{
    return <input {...props} type="range" className={classes('RangeSlider', props.className)} />
}