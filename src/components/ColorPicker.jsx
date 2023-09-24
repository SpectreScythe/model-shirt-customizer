import {SketchPicker} from "react-color";
import { useSnapshot } from 'valtio'

import state from '../store'
export default function ColorPicker() {
    const snap = useSnapshot(state)

    const presetColors = [
        "#FF0000", // Red
        "#DC143C", // Crimson
        "#00FF00", // Green
        "#FFFF00", // Yellow
        "#DAA520", // Gold
        "#800080", // Purple
        "#FFC0CB", // Pink
        "#008080", // Teal
        "#A52A2A", // Brown
        "#00FFFF", // Cyan
        "#E6E6FA", // Lavender
        "#808080"  // Grey
    ];


    return (
        <div className={"absolute left-full ml-3"}>
            <SketchPicker
                color={snap.color}
                disableAlpha
                presetColors={presetColors}
                onChange={(color) => state.color = color.hex}
            />
        </div>
    )
}