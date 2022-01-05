import React from "react";
import "./Result.scss";

export default function Result({
    showResult,
    number,
    nakshatra,
    ruler,
    setShowResult,
}) {
    return (
        <div className={`result ${showResult ? "show" : ""}`}>
            <div className="number">
                Number: <br />
                <h1>{number}</h1>
            </div>
            <div className="nakshtra">
                Nakshatra:
                <h1>{nakshatra}</h1>
            </div>
            <div className="ruler">
                <img
                    src={
                        ruler
                            ? require(`./images/ruler/${ruler.toLowerCase()}.png`)
                            : null
                    }
                    alt=""
                />
                Ruler: <h1>{ruler}</h1>
            </div>
            <button onClick={() => setShowResult(false)}>Go Back</button>
        </div>
    );
}
