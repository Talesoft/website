
import './App.scss';
import React, {ReactNode} from 'react';
import Sidebar from "./Sidebar";
import {classes} from "../possible-future-libraries/react-utils/index";

export enum AppColorMode
{
    LIGHT = 'light',
    DARK = 'dark',
    MONOCHROME_LIGHT = 'monochrome-light',
    MONOCHROME_DARK = 'monochrome-dark'
}

export interface AppProps
{
    colorMode?: AppColorMode;
    children?: ReactNode;
}

export default function App({children, colorMode = AppColorMode.LIGHT}: AppProps)
{
    return <main className={classes('App', `App--color-mode-${colorMode}`)}>
        <Sidebar />
        <div className="App__body">
            {children}
        </div>
    </main>;
}