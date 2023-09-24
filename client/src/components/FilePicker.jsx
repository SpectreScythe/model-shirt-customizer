import CustomButton from "./CustomButton.jsx";
import state from '../store'
import {useSnapshot} from "valtio";
import {getContrastingColor} from "../config/helpers.js";
export default function FilePicker({file, setFile, readFile}) {
    const snap = useSnapshot(state)
    return (
        <div className="filepicker-container">
            <div className="flex-1 flex flex-col">
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="filepicker-label">
                    Upload File
                </label>

                <p className={"mt-2 text-gray-500 text-xs truncate"} style={{color: getContrastingColor(snap.color)}}>
                    {file === ''? 'No file selected' : file.name}
                </p>

                <div className={"mt-4 flex flex-wrap gap-3"}>
                    <CustomButton
                        type={'outline'}
                        title={"Logo"}
                        handleClick={() => readFile('logo')}
                        customStyles="text-xs"
                    />
                    <CustomButton
                        type={'filled'}
                        title={"Full"}
                        handleClick={() => readFile('full')}
                        customStyles="text-xs"
                    />
                </div>
            </div>
        </div>
    )
}