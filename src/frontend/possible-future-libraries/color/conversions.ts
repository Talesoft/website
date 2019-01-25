
import {HslColor, HsvColor, RgbColor} from "./Color";

const {min, max, floor} = Math;
export const SCALE_RGB: Readonly<RgbColor> = {red: 255, green: 255, blue: 255};
export const SCALE_HSL: Readonly<HslColor> = {hue: 360, saturation: 1, lightness: 1};
export const SCALE_HSV: Readonly<HsvColor> = {hue: 360, saturation: 1, value: 1};

function hueToRgb(p: number, q: number, t: number): number
{
    //Normalize
    if (t < 0) {
        t += 1;
    } else if (t > 1) {
        t -= 1;
    }
    //Convert
    if (t < 1/6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1/2) {
        return q;
    }
    if (t < 2/3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}

function toHex(value: number)
{
    return value.toString(16).padStart(2, '0').toUpperCase();
}

/**
 * RGB -> HSL
 *
 * @param red
 * @param green
 * @param blue
 * @param rgbScale
 * @param hslScale
 */
export function rgbToHsl(
    {red = 0, green = 0, blue = 0}: RgbColor,
    rgbScale: RgbColor = SCALE_RGB,
    hslScale: HslColor = SCALE_HSL
): HslColor
{
    const r = red / rgbScale.red;
    const g = green / rgbScale.green;
    const b = blue / rgbScale.blue;
    const maxValue = max(r, g, b);
    const minValue = min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (maxValue + minValue) / 2;
    if (maxValue !== minValue) {
        const d = maxValue - minValue;
        s = l > 0.5 ? d / (2 - maxValue - minValue) : d / (maxValue + minValue);
        switch (maxValue) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        hue: h * hslScale.hue,
        saturation: s * hslScale.saturation,
        lightness: l * hslScale.lightness
    };
}

/**
 * RGB -> HSV
 *
 * @param red
 * @param green
 * @param blue
 * @param rgbScale
 * @param hsvScale
 */
export function rgbToHsv(
    {red = 0, green = 0, blue = 0}: RgbColor,
    rgbScale: RgbColor = SCALE_RGB,
    hsvScale: HsvColor = SCALE_HSV
): HsvColor
{
    const r = red / rgbScale.red;
    const g = green / rgbScale.green;
    const b = blue / rgbScale.blue;
    const maxValue = max(r, g, b);
    const minValue = min(r, g, b);
    const d = maxValue - minValue;
    let h = 0;
    const s = maxValue === 0 ? 0 : d / minValue;
    const v = maxValue;
    if (maxValue !== minValue) {
        switch (maxValue) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        hue: h * hsvScale.hue,
        saturation: s * hsvScale.saturation,
        value: v * hsvScale.value
    };
}

/**
 * HSL -> RGB
 * 
 * @param hue
 * @param saturation
 * @param lightness
 * @param hslScale
 * @param rgbScale
 */
export function hslToRgb(
    {hue, saturation, lightness}: HslColor,
    hslScale: HslColor = SCALE_HSL,
    rgbScale: RgbColor = SCALE_RGB
): RgbColor
{
    let r = 0;
    let g = 0;
    let b = 0;
    const h = hue / hslScale.hue;
    const s = saturation / hslScale.saturation;
    let l = lightness / hslScale.lightness;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }
    return {
        red: r * rgbScale.red,
        green: g * rgbScale.green,
        blue: b * rgbScale.blue
    };
}

/**
 * HSV -> RGB
 *
 * @param hue
 * @param saturation
 * @param value
 * @param hsvScale
 * @param rgbScale
 */
export function hsvToRgb(
    {hue, saturation, value}: HsvColor,
    hsvScale: HsvColor = SCALE_HSV,
    rgbScale: RgbColor = SCALE_RGB
): RgbColor
{
    const h = hue / hsvScale.hue;
    const s = saturation / hsvScale.saturation;
    const v = value / hsvScale.value;
    let r = 0;
    let g = 0;
    let b = 0;
    const i = floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        red: r * rgbScale.red,
        green: g * rgbScale.green,
        blue: b * rgbScale.blue
    };
}

/**
 * RGB -> #RGB Hex String
 * @param red
 * @param green
 * @param blue
 */
export function rgbToHex({red, green, blue}: RgbColor)
{
    let hex = toHex(red) + toHex(green) + toHex(blue);
    if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
        hex = hex[0] + hex[2] + hex[4];
    }
    return `#${hex}`;
}

export function hexToRgb(hex: string)
{
    if ((hex.length !== 4 && hex.length !== 7) || hex[0] !== '#') {
        throw new Error(`Failed to convert "${hex}" to RGB: Not a valid hex string`);
    }
    const partLength = hex.length === 4 ? 1 : 2;
    hex = hex.substr(1);
    const parts = [
        hex.substr(0, partLength),
        hex.substr(partLength, partLength),
        hex.substr(partLength * 2, partLength)
    ];
    const [red, green, blue] = parts.map(part => parseInt(part.padEnd(2, part), 16));
    return {red, green, blue};
}