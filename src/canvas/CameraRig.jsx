import {useFrame} from "@react-three/fiber";
import {easing} from "maath";
import {useSnapshot} from "valtio";

import state from '../store'
import {useRef} from "react";


export default function CameraRig({children}) {
    const snap = useSnapshot(state)
    const group = useRef()

    useFrame((state, delta) => {
        const isBreakpoint = window.innerWidth <= 1260;
        const isMobile = window.innerWidth <= 600;

        // set the initial position of the model
        let targetPosition = [-0.4, 0, 2];

        if (snap.intro) {
            if (isBreakpoint) targetPosition = [0, 0, 2]
            if (isMobile) targetPosition = [0, 0.2, 2.5]
        } else {
            if (isMobile) targetPosition = [0, 0, 2.5]
            else targetPosition = [0, 0, 2]
        }

        easing.damp3(state.camera.position, targetPosition, 0.25, delta)

        // set the model rotation
        easing.dampE(
            group.current.rotation,
            [state.pointer.y / 1.5, state.pointer.x / 1.5, 0],
            0.15,
            delta
        )
    })

    return (
        <group ref={group}>
            {children}
        </group>
    )
}