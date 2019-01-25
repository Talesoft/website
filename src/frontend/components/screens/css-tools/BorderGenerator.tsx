
import React, {Component} from "react";
import CssPreview from "./CssPreview";

export default class BorderGenerator extends Component
{
    render()
    {
        return <div className="BorderGenerator">
            <div className="BorderGenerator__row">
                <div className="BorderGenerator__cell BorderGenerator__cell--top-left">

                </div>
                <div className="BorderGenerator__cell BorderGenerator__cell--top">

                </div>
                <div className="BorderGenerator__cell BorderGenerator__cell--top-right">

                </div>
            </div>


            <div className="BorderGenerator__cell BorderGenerator__cell--left">

            </div>
            <div className="BorderGenerator__cell BorderGenerator__cell--middle">
                <CssPreview css={'font-size: 12px;'} />
            </div>
            <div className="BorderGenerator__cell BorderGenerator__cell--right">

            </div>


            <div className="BorderGenerator__cell BorderGenerator__cell--bottom-left">

            </div>
            <div className="BorderGenerator__cell BorderGenerator__cell--bottom">

            </div>
            <div className="BorderGenerator__cell BorderGenerator__cell--bottom-right">

            </div>
        </div>;
    }
}