import "./App.scss";
import { useState, useEffect, useReducer } from "react";
import table1 from "./table1.json";
import table2 from "./table2.json";

const reducer = (state, action) => {
    if (action.type === "minutes" || action.type === "degree") {
        return { ...state, [action.type]: Number(action.value) };
    }
    return { ...state, [action.type]: action.value };
};

const initialState = {
    planet: "Saturn",
    degree: 0,
    minutes: 0,
    zodiac: "Ar",
    output1: 0,
    nakshatra: "",
    ruler: "",
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState({});

    const createRatio = (degree = 30, minutes = 60) => {
        const degreeRatio = (degree * 100) / 30;
        const minutesRatio = minutes / 60;
        return degreeRatio + minutesRatio;
    };

    const validateForm = () => {
        if (state.degree > 30 || state.degree < 0) {
            setError({
                type: "degree",
                message: "Degree must be between 0 to 30",
            });
            return false;
        }
        if (state.minutes > 60 || state.minutes < 0) {
            setError({
                type: "minutes",
                message: "Minutes must be between 0 to 60",
            });
            return false;
        }
        if (state.degree === 30 && state.minutes > 0) {
            setError({
                type: "minutes",
                message:
                    "Values must be between 0 degree 0 minutes - 30 degree 0 minutes",
            });
            return false;
        }
        setError({});
        return true;
    };

    const setPlanet = () => {
        var planet;
        const currentRatio = createRatio(state.degree, state.minutes);
        if (currentRatio <= createRatio(3, 45)) planet = "Saturn";
        else if (currentRatio <= createRatio(7, 30)) planet = "Jupiter";
        else if (currentRatio <= createRatio(11, 15)) planet = "Mars";
        else if (currentRatio <= createRatio(15, 0)) planet = "Sun";
        else if (currentRatio <= createRatio(18, 45)) planet = "Venus";
        else if (currentRatio <= createRatio(22, 30)) planet = "Mercury";
        else if (currentRatio <= createRatio(26, 15)) planet = "Moon";
        else if (currentRatio <= createRatio(30, 0)) planet = "Ascendant";
        dispatch({ type: "planet", value: planet });
    };

    useEffect(() => {
        if (validateForm()) {
            setPlanet();
        }
        // eslint-disable-next-line
    }, [state.degree, state.minutes]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error.message) return false;
        const output1 = table1[state.planet][state.zodiac];
        dispatch({ type: "output1", value: output1 });
        const { degree, minutes, zodiac } = state;
        const output2 = table2.filter((row) => {
            const [minDegree, minZodiac, minMinutes] = row.min.split(" ");
            const [maxDegree, maxZodiac, maxMinutes] = row.max.split(" ");
            const currentRatio = createRatio(degree, minutes);
            var minRatio = createRatio(minDegree, minMinutes);
            var maxRatio = createRatio(maxDegree, maxMinutes);
            if (minZodiac === zodiac) {
                if (maxZodiac !== zodiac) {
                    maxRatio = createRatio();
                }
            } else if (maxZodiac === zodiac) {
                minRatio = 0;
                maxRatio = createRatio(maxDegree, maxMinutes);
            } else {
                return false;
            }
            return currentRatio < maxRatio && minRatio <= currentRatio;
        });
        if (output2.length) {
            const [{ ruler, nakshatra }] = output2;
            dispatch({ type: "ruler", value: ruler });
            dispatch({ type: "nakshatra", value: nakshatra });
        }
    };
    return (
        <>
            <h1>
                <img src="" alt="" srcSet="" /> Nakshatra
            </h1>
            <div className="input-box">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="planet">Planet</label>
                    <select
                        name="planet"
                        id="planet"
                        value={state.planet}
                        onChange={(e) =>
                            dispatch({
                                type: e.target.name,
                                value: e.target.value,
                            })
                        }>
                        <option value="Saturn">Saturn</option>
                        <option value="Jupiter">Jupiter</option>
                        <option value="Mars">Mars</option>
                        <option value="Sun">Sun</option>
                        <option value="Venus">Venus</option>
                        <option value="Mercury">Mercury</option>
                        <option value="Moon">Moon</option>
                        <option value="Ascendant">Ascendant</option>
                    </select>
                    <div className="degree-minutes">
                        <div className="degree">
                            <label htmlFor="degree">Degree</label>
                            <input
                                type="number"
                                name="degree"
                                className={
                                    error.type === "degree" ? "invalid" : null
                                }
                                id="degree"
                                value={state.degree}
                                min={0}
                                max={30}
                                onChange={(e) =>
                                    dispatch({
                                        type: e.target.name,
                                        value: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="minutes">
                            <label htmlFor="minutes">Minutes</label>
                            <input
                                type="number"
                                name="minutes"
                                className={
                                    error.type === "minutes" ? "invalid" : null
                                }
                                id="minutes"
                                value={state.minutes}
                                min={0}
                                max={60}
                                onChange={(e) =>
                                    dispatch({
                                        type: e.target.name,
                                        value: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    {error.message ? (
                        <div className="error">{error.message}</div>
                    ) : null}
                    <label htmlFor="zodiac">Zodiac</label>
                    <select
                        name="zodiac"
                        id="zodiac"
                        value={state.zodiac}
                        onChange={(e) =>
                            dispatch({
                                type: e.target.name,
                                value: e.target.value,
                            })
                        }>
                        <option value="Ar">Aries</option>
                        <option value="Ta">Taurus</option>
                        <option value="Ge">Gemini</option>
                        <option value="Ca">Cancer</option>
                        <option value="Le">Leo</option>
                        <option value="Vi">Virgo</option>
                        <option value="Li">Libra</option>
                        <option value="Sc">Scorpio</option>
                        <option value="Sa">Sagittarius</option>
                        <option value="Cp">Capricorn</option>
                        <option value="Aq">Aquarius</option>
                        <option value="Pi">Pisces</option>
                    </select>
                    <input type="submit" value="Show Nakshatra" />
                </form>
                {state.output1 ? (
                    <div className="output">
                        <div className="number">Number: {state.output1}</div>
                        <div className="nakshtra">
                            Nakshatra: {state.nakshatra}
                        </div>
                        <div className="ruler">Ruler: {state.ruler}</div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default App;
