
/** Common, basic interfaces */
export type Language = 'en'|'de';

export type Translation = {[name in Language]: string}

export enum ColorMode
{
    LIGHT = 'light',
    DARK = 'dark',
    MONOCHROME_LIGHT = 'monochrome-light',
    MONOCHROME_DARK = 'monochrome-dark',
    CONTRAST_LIGHT = 'contrast-light',
    CONTRAST_DARK = 'contrast-dark'
}