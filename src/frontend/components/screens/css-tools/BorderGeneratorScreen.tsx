
import React from 'react';
import BorderGenerator from "./BorderGenerator";

export default function BorderGeneratorScreen()
{
    return <div className="BorderGeneratorScreen screen">
        <header className="BorderGeneratorScreen__header header">
            <h1>Border Generator</h1>
        </header>
        <BorderGenerator />
    </div>;
}