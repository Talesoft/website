
import './Sidebar.scss';
import React, {useState} from 'react';
import TalesoftLogo from "./images/TalesoftLogo";
import {NavLink, withRouter} from "react-router-dom";
import {RouteChildrenProps} from "react-router";
import {classes} from "../possible-future-libraries/react-utils/index";

function Sidebar({location}: Partial<RouteChildrenProps>)
{
    const [contracted, setContracted] = useState(false);
    const [openChild, setOpenChild] = useState<string|null>(
        location
            ? ((location.pathname.startsWith('/css-tools') && 'css-tools')
            || (location.pathname.startsWith('/html-tools') && 'html-tools')
            || (location.pathname.startsWith('/bootstrap-tools') && 'bootstrap-tools')
            || (location.pathname.startsWith('/canvas-tools') && 'canvas-tools')
            || (location.pathname.startsWith('/javascript-tools') && 'javascript-tools')
            || (location.pathname.startsWith('/other-tools') && 'other-tools')
            || null)
            : null
    );

    function onOpenChild(name: string)
    {
        return () => !contracted && setOpenChild(name !== openChild ? name : null);
    }

    return <aside className={classes('Sidebar', contracted && `Sidebar--contracted`)}>
        <div className="Sidebar__container">
            <header className="Sidebar__header">
                <NavLink className="Sidebar__logo" to="/">
                    <TalesoftLogo text={!contracted} />
                </NavLink>
            </header>

            <nav className="Sidebar__nav nav">
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'css-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/css-tools" onClick={onOpenChild('css-tools')}>
                        <i className="fab fa-fw fa-css3-alt" />
                        {!contracted && 'CSS Tools'}
                    </NavLink>
                    {openChild === 'css-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/css-tools/uglifier">Uglifier</NavLink>
                        <NavLink className="nav-link" to="/css-tools/beautifier">Beautifier</NavLink>
                        <NavLink className="nav-link" to="/css-tools/border-generator">Border Generator</NavLink>
                        <NavLink className="nav-link" to="/css-tools/box-shadow-generator">Box Shadow Generator</NavLink>
                        <NavLink className="nav-link" to="/css-tools/flexbox-generator">Flexbox Generator</NavLink>
                        <NavLink className="nav-link" to="/css-tools/snippets">Snippets</NavLink>
                    </nav>}
                </div>
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'html-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/html-tools" onClick={onOpenChild('html-tools')}>
                        <i className="fab fa-fw fa-html5" />
                        {!contracted && 'HTML Tools'}
                    </NavLink>
                    {openChild === 'html-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/html-tools/uglifier">Uglifier</NavLink>
                        <NavLink className="nav-link" to="/html-tools/beautifier">Beautifier</NavLink>
                        <NavLink className="nav-link" to="/html-tools/skeleton-generator">Skeleton Generator</NavLink>
                        <NavLink className="nav-link" to="/html-tools/grid-generator">Grid Generator</NavLink>
                        <NavLink className="nav-link" to="/html-tools/table-generator">Table Generator</NavLink>
                        <NavLink className="nav-link" to="/html-tools/snippets">Snippets</NavLink>
                    </nav>}
                </div>
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'bootstrap-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/bootstrap-tools" onClick={onOpenChild('bootstrap-tools')}>
                        <i className="fas fa-fw fa-hat-wizard" />
                        {!contracted && 'Bootstrap Tools'}
                    </NavLink>
                    {openChild === 'bootstrap-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/bootstrap-tools/navbar-generator">Navbar Generator</NavLink>
                        <NavLink className="nav-link" to="/bootstrap-tools/nav-generator">Nav Generator</NavLink>
                        <NavLink className="nav-link" to="/bootstrap-tools/card-generator">Card Generator</NavLink>
                    </nav>}
                </div>
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'canvas-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/canvas-tools" onClick={onOpenChild('canvas-tools')}>
                        <i className="fas fa-fw fa-paint-brush" />
                        {!contracted && 'Canvas Tools'}
                    </NavLink>
                    {openChild === 'canvas-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/canvas-tools/loop-generator">Loop Generator</NavLink>
                        <NavLink className="nav-link" to="/canvas-tools/rectangle-generator">Rectangle Generator</NavLink>
                        <NavLink className="nav-link" to="/canvas-tools/circle-generator">Circle Generator</NavLink>
                        <NavLink className="nav-link" to="/canvas-tools/star-generator">Star Generator</NavLink>
                        <NavLink className="nav-link" to="/canvas-tools/snippets">Snippets</NavLink>
                    </nav>}
                </div>
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'javascript-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/javascript-tools" onClick={onOpenChild('javascript-tools')}>
                        <i className="fas fa-fw fa-code" />
                        {!contracted && 'JavaScript Tools'}
                    </NavLink>
                    {openChild === 'javascript-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/javascript-tools/snippets">Snippets</NavLink>
                    </nav>}
                </div>
                <div className={classes('Sidebar__nav-item nav-item', openChild === 'other-tools' && 'Sidebar__nav-item--open')}>
                    <NavLink className="nav-link" to="/other-tools" onClick={onOpenChild('other-tools')}>
                        <i className="fas fa-fw fa-asterisk" />
                        {!contracted && 'Other Tools'}
                    </NavLink>
                    {openChild === 'other-tools' && <nav className="Sidebar__nav--sub nav">
                        <NavLink className="nav-link" to="/other-tools/grid-generator">Grid Generator</NavLink>
                        <NavLink className="nav-link" to="/other-tools/beautifier">Beautifier</NavLink>
                        <NavLink className="nav-link" to="/other-tools/skeleton-generator">Skeleton Generator</NavLink>
                    </nav>}
                </div>
            </nav>

            <footer className="Sidebar__footer">
                <a className="Sidebar__expand-link nav-link" href={`javascript://${contracted ? 'Expand' : 'Contract'} Sidebar`} onClick={() =>
                    {
                        setOpenChild(null);
                        setContracted(!contracted);
                    }}>
                    <i className={`fas fa-fw fa-angle-double-${contracted ? 'right' : 'left'}`} />
                    {!contracted && 'Contract Sidebar'}
                </a>
            </footer>
        </div>
    </aside>;
}

export default withRouter(Sidebar);