
import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from "./App";
import HomeScreen from "./screens/HomeScreen";
import CssToolsScreen from "./screens/CssToolsScreen";
import BorderGeneratorScreen from "./screens/css-tools/BorderGeneratorScreen";

export default function Router()
{
    return <HashRouter>
        <App>
            <Switch>
                <Route exact path="/" component={HomeScreen} />
                <Route exact path="/css-tools" component={CssToolsScreen} />
                <Route exact path="/css-tools/border-generator" component={BorderGeneratorScreen} />
            </Switch>
        </App>
    </HashRouter>;
}