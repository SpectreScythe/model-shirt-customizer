import {useSnapshot} from "valtio";

import state from '../store'


export default function Tab({tab, isActiveTab, isFilterTab, handleClick}) {
    const snap = useSnapshot(state)

    const activeStyles = isFilterTab && isActiveTab ?
        {backgroundColor: snap.color, opacity: 0.5}
        : {backgroundColor: 'transparent', opacity: 1}

    return (
        <div
            key={tab.name}
            className={`tab-btn ${isFilterTab ? 'rounded-md glassmorphism' : 'rounded-4'}`}
            onClick={handleClick}
            style={activeStyles}
        >
            <img src={tab.icon} alt="" />
        </div>
    )
}