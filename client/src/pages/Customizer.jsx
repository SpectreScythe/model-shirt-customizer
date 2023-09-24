import {useState, useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {useSnapshot} from 'valtio'

import config from "../config/config.js";
import state from "../store/index.js";
import {downloadCanvasToImage, reader} from '../config/helpers.js'
import {EditorTabs, FilterTabs, DecalTypes} from "../config/constants.js";
import {fadeAnimation, slideAnimation} from "../config/motion.js";
import {CustomButton, Tab, AIPicker, ColorPicker, FilePicker} from '../components'

export default function Customizer() {
    const snap = useSnapshot(state)

    const [file, setFile] = useState('')
    const [prompt, setPrompt] = useState('')
    const [generatingImg, setGeneratingImg] = useState(false)

    const [activeEditorTabs, setActiveEditorTabs] = useState('')
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false
    })

    function generateTabContent() {
        switch (activeEditorTabs) {
            case "colorpicker":
                return <ColorPicker/>
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case "aipicker":
                return <AIPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null;
        }
    }

    // async function handleSubmit(type) {
    //     if (!prompt) return alert('Please enter a prompt');
    //
    //     try {
    //         setGeneratingImg(true)
    //         const response = await fetch(config.development.backendUrl, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({prompt})
    //         })
    //
    //         const data = await response.json()
    //         handleDecals(type, `data:image/png;base64,${data.photo}`)
    //     } catch (e) {
    //         alert(e.message)
    //     } finally {
    //         setGeneratingImg(false)
    //         setActiveEditorTabs('')
    //     }
    // }

    async function handleSubmit(type) {
        if (!prompt) return alert('Please enter a prompt');

        try {
            setGeneratingImg(true);

            const response = await fetch(config.development.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            // Image conversion
            const imageUrl = data.photo;

            // Fetch the image data
            const imageResponse = await fetch(imageUrl);
            const blob = await imageResponse.blob();

            // Convert the image blob to Base64
            const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // Create a JSON object
            const imageJson = {
                imageUrl: imageUrl,
                base64Data: base64Data,
            };

            console.log()

            // Now you can use the image JSON as needed
            handleDecals(type, imageJson.base64Data);
        } catch (error) {
            console.error('Error:', error);
        }
        finally {
            setGeneratingImg(false)
            setActiveEditorTabs('')
        }
    }

    function handleDecals(type, result) {
        const decalType = DecalTypes[type]
        state[decalType.stateProperty] = result

        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    function handleActiveFilterTab(tabName) {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            case "download":
                downloadCanvasToImage();
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
        }
        setActiveFilterTab({
            logoShirt: state.isLogoTexture,
            stylishShirt: state.isFullTexture
        })
    }

    function readFile(type) {
        reader(file)
            .then((result) => {
                handleDecals(type, result)
                setActiveEditorTabs("")
            })
    }

    return (
        <AnimatePresence>
            {!snap.intro &&
                <>
                    <motion.div
                        key={"custom"}
                        className={"absolute top-0 left-0 z-10"}
                        {...slideAnimation('left')}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => {
                                            setActiveEditorTabs(tab.name)
                                        }}
                                    />
                                ))}

                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}
                    >
                        <CustomButton
                            type={'filled'}
                            title={'Go Back'}
                            handleClick={() => state.intro = true}
                            customStyles={"w-fit px-4 py-2.5 font-bold text-sm"}
                        />
                    </motion.div>

                    <motion.div
                        className={"filtertabs-container"}
                        {...slideAnimation('up')}
                    >
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}
                    </motion.div>

                </>
            }
        </AnimatePresence>
    )
}