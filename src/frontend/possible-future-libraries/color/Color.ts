
import {hexToRgb, hslToRgb, hsvToRgb, rgbToHex, rgbToHsl, rgbToHsv} from "./conversions";

export const EXPRESSION_PATTERN = /^((?:rgb|hs[lv])a?)\(([^)]+)+\)$/;

export interface AlphaColor
{
    alpha: number;
}

export interface RgbColor
{
    red: number;
    green: number;
    blue: number;
}

export interface RgbaColor extends RgbColor, AlphaColor
{
}

export interface HsColor
{
    hue: number;
    saturation: number;
}

export interface HslColor extends HsColor
{
    lightness: number;
}

export interface HslaColor extends HslColor, AlphaColor
{
}

export interface HsvColor extends HsColor
{
    value: number;
}

export interface HsvaColor extends HsvColor, AlphaColor
{
}

export default class Color implements RgbColor, HslColor, HsvColor, AlphaColor
{
    red: number;
    green: number;
    blue: number;
    alpha: number;

    constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1)
    {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    get rgb(): RgbColor
    {
        return {red: this.red, green: this.green, blue: this.blue};
    }

    set rgb(rgb: RgbColor)
    {
        this.red = rgb.red;
        this.green = rgb.green;
        this.blue = rgb.blue;
    }

    get rgbString(): string
    {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    get rgba(): RgbaColor
    {
        return {...this.rgb, alpha: this.alpha};
    }

    set rgba(rgba: RgbaColor)
    {
        this.rgb = rgba;
        this.alpha = rgba.alpha;
    }

    get rgbaString(): string
    {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha.toFixed(3)})`;
    }

    get hex(): string
    {
        return rgbToHex(this);
    }

    set hex(value: string)
    {
        this.rgb = hexToRgb(value);
    }

    get hsl(): HslColor
    {
        return rgbToHsl(this);
    }

    set hsl(hsl: HslColor)
    {
        this.rgb = hslToRgb(hsl);
    }

    get hsla(): HslaColor
    {
        return {...this.hsl, alpha: this.alpha};
    }

    set hsla(hsla: HslaColor)
    {
        this.hsl = hsla;
        this.alpha = hsla.alpha;
    }

    get hsv(): HsvColor
    {
        return rgbToHsv(this);
    }

    set hsv(hsv: HsvColor)
    {
        this.rgb = hsvToRgb(hsv);
    }

    get hsva(): HsvaColor
    {
        return {...this.hsv, alpha: this.alpha};
    }

    set hsva(hsva: HsvaColor)
    {
        this.hsv = hsva;
        this.alpha = hsva.alpha;
    }

    get hue(): number
    {
        return this.hsl.hue;
    }

    set hue(hue: number)
    {
        this.rgb = hslToRgb({...rgbToHsl(this), hue});
    }

    get saturation(): number
    {
        return this.hsl.saturation;
    }

    set saturation(saturation: number)
    {
        this.rgb = hslToRgb({...rgbToHsl(this), saturation});
    }

    get lightness(): number
    {
        return this.hsl.lightness;
    }

    set lightness(lightness: number)
    {
        this.rgb = hslToRgb({...rgbToHsl(this), lightness});
    }

    get value(): number
    {
        return this.hsv.value;
    }

    set value(value: number)
    {
        this.rgb = hsvToRgb({...rgbToHsl(this), value});
    }

    clone(modifier?: (color: Color) => void): Color
    {
        const clone = new Color(this.red, this.green, this.blue, this.alpha);
        if (modifier) {
            modifier(clone);
        }
        return clone;
    }

    toString()
    {
        if (this.alpha !== 1) {
            return this.rgbaString;
        }
        return this.hex;
    }

    static fromHex(hex: string): Color
    {
        const {red, green, blue} = hexToRgb(hex);
        return new Color(red, green, blue);
    }

    static fromExpression(expr: string): Color
    {
        const matches = expr.match(EXPRESSION_PATTERN);
        if (matches === null) {
            throw Error('Not a valid color expression');
        }
        const [, type, params] = matches;
        const values = params.split(',').map(p => p.trim());
        console.log(values);
        let alpha = 1;
        if (type.endsWith('a')) {
            if (values.length < 3) {
                throw Error(`${type} expression is lacking alpha value`);
            }
            alpha = parseFloat(values[3]);
        }

        if (type.startsWith('rgb')) {
            return new Color(...values.slice(0, 3).map(v => parseInt(v)), alpha);
        }

        const [h, s, lv] = values;
        if (!s.endsWith('%')) {
            throw Error('Saturation needs to be percent value');
        }

        if (!lv.endsWith('%')) {
            throw new Error(`${type.startsWith('hsl') ? 'Lightness' : 'Value'} needs to be percent value`);
        }
        const hue = parseFloat(h);
        const saturation = parseFloat(s) / 100;
        const lightnessOrValue = parseFloat(lv) / 100;
        const {red, green, blue} = type.startsWith('hsl')
            ? hslToRgb({hue, saturation, lightness: lightnessOrValue})
            : hsvToRgb({hue, saturation, value: lightnessOrValue});
        return new Color(red, green, blue, alpha);
    }

    static fromString(value: string): Color
    {
        try {
            return Color.fromHex(value);
        } catch (err) {
        }

        try {
            return Color.fromExpression(value);
        } catch (err) {
        }

        throw new Error(`Failed to parse color ${value}`);
    }
}