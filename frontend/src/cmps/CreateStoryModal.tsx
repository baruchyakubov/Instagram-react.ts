import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Props } from "../interfaces/props";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { showErrorMsg } from "../services/event-bus.service";
import { UploadUserImg } from "./UploadUserImg";
import { addStory } from "../store/actions/story.actions";
import { useNavigate } from "react-router-dom";

export function CreateStoryModal({ setIsCreateModalOpen }: Props) {
    const [imgUrl, setImgUrl] = useState('')
    const [imgUrl2, setImgUrl2] = useState('')
    const [imgUrl3, setImgUrl3] = useState('')
    const [imgUrl4, setImgUrl4] = useState('')
    const [text, setText] = useState('')
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const navigate = useNavigate()

    const AddStory = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        if (!imgUrl && !imgUrl2 && !imgUrl3 && !imgUrl4) {
            showErrorMsg('Missing required fields')
            return
        }
        let imgUrls = []
        if (imgUrl)
            imgUrls.push(imgUrl)
        if (imgUrl2)
            imgUrls.push(imgUrl2)
        if (imgUrl3)
            imgUrls.push(imgUrl3)
        if (imgUrl4)
            imgUrls.push(imgUrl4)

        const createdBy = {
            _id: loggedInUser?._id,
            username: loggedInUser?.username,
            imgUrl: loggedInUser?.imgUrl
        }    

        dispatch(addStory({ text, imgUrls , createdBy } , navigate))
        if(setIsCreateModalOpen) setIsCreateModalOpen(false)
    }

    const handleInput = (ev: React.FormEvent<HTMLInputElement>): void => {
        const target = ev.target as any
        setText(target.value)
    }

    return (
        <>
            <div onClick={() => { if (setIsCreateModalOpen) setIsCreateModalOpen(false) }} className="opacity-wrapper"></div>
            <form onSubmit={AddStory} className="create-story-modal">
                <div className="create-header">
                    <h1>Create new post</h1>
                </div>
                <div className="add-imgs-section">
                    <UploadUserImg imgUrl={imgUrl} setImgUrl={setImgUrl}></UploadUserImg>
                    <UploadUserImg imgUrl={imgUrl2} setImgUrl={setImgUrl2}></UploadUserImg>
                    <UploadUserImg imgUrl={imgUrl3} setImgUrl={setImgUrl3}></UploadUserImg>
                    <UploadUserImg imgUrl={imgUrl4} setImgUrl={setImgUrl4}></UploadUserImg>
                </div>
                <input onInput={handleInput} className="add-text" type="text" placeholder="Add text" />
                <button className="create">Create</button>
            </form>
        </>

    )
}