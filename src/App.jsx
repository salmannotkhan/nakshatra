import "./App.css";
import { useEffect, useReducer } from "react";
import table1 from "./table1.json";
import table2 from "./table2.json";

const reducer = (state, action) => {
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
    const createRatio = (degree = 30, minutes = 60) => {
        const degreeRatio = (degree * 10) / 30;
        const minutesRatio = minutes / 60;
        return degreeRatio + minutesRatio;
    };

    useEffect(() => {
        const { degree, minutes } = state;
        const currentRatio = createRatio(degree, minutes);
    }, [state]);

    const handleSubmit = (e) => {
        e.preventDefault();
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
        <div className="input-box">
            <form onSubmit={handleSubmit}>
                <select
                    name="planet"
                    value={state.planet}
                    onChange={(e) =>
                        dispatch({ type: e.target.name, value: e.target.value })
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
                <input
                    type="number"
                    name="degree"
                    value={state.degree}
                    min={0}
                    max={30}
                    onChange={(e) =>
                        dispatch({ type: e.target.name, value: e.target.value })
                    }
                />
                <input
                    type="number"
                    name="minutes"
                    value={state.minutes}
                    min={0}
                    max={60}
                    onChange={(e) =>
                        dispatch({ type: e.target.name, value: e.target.value })
                    }
                />
                <select
                    name="zodiac"
                    value={state.zodiac}
                    onChange={(e) =>
                        dispatch({ type: e.target.name, value: e.target.value })
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
                <input type="submit" value="show" />
            </form>
            {state.output1}
            {state.ruler}
            {state.nakshatra}
        </div>
    );
}

export default App;
