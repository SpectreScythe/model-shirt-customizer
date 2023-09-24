import state from '../store'
import {useSnapshot} from "valtio";
import {getContrastingColor} from "../config/helpers.js";

export default function CustomButton({title, type, customStyles, handleClick}) {
    const snap = useSnapshot(state)

    const generateStyle = (type) => {
        if (type === 'filled') {
            return {
                backgroundColor: snap.color,
                color: getContrastingColor(snap.color)
            }
        }
        if (type === 'outline') {
            return {
                backgroundColor: 'transparent',
                color: getContrastingColor(snap.color),
                border: '1px solid ' + getContrastingColor(snap.color)
            }
        }
    }
    
    return (
        <>
            <button
                className={"px-2 py-1.5 flex-1 rounded-md " + customStyles}
                style={generateStyle(type)}
                onClick={handleClick}
            >
                {title}
            </button>
        </>
    )
}