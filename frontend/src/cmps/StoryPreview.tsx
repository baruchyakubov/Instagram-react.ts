import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { eventBus, showErrorMsg } from "../services/event-bus.service";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { PostBtnsAction } from "./PostBtnsAction";
import { ImgCarousel } from "./ImgCarousel";
import { utilService } from "../services/util.service";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { addUserComment, changeLikeStatus, deleteStory } from "../store/actions/story.actions";
import { CommentInputBox } from "./CommentInputBox";
import { changeSaveStatus } from "../store/actions/user.actions";
import { SettingsCmp } from "./SettingsCmp";
import { useCheckIfLiked } from "../custom-hooks/useCheckIfLiked";
import { useCheckIfSaved } from "../custom-hooks/useCheckIfSaved";

export function StoryPreview({ storyData }: Props) {
    let navigate = useNavigate();
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const [isSettingLikeStatus, setIsSettingLikeStatus] = useState<boolean>(false)
    const [isSettingSaveStatus, setIsSettingSaveStatus] = useState<boolean>(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    useEffect(() => {
        checkIfLiked()
    }, [storyData?.story, loggedInUser?._id])

    useEffect(() => {
        checkIfSaved()
    }, [loggedInUser])

    const checkIfSaved = (): void => useCheckIfSaved(setIsSaved, loggedInUser, storyData?.story)
    const checkIfLiked = (): void => useCheckIfLiked(setIsLiked, loggedInUser, storyData?.story)

    const openDetsils = (): void => {
        navigate(`/details/${storyData?.story._id}/${storyData?.idx}`)
    }

    const goToProfile = (): void => {
        navigate(`/profile/${storyData?.story.by._id}`)
    }

    const openUserListModal = (): void => {
        eventBus.emit('openUserListModal', { userList: storyData?.story.likedBy, title: 'Likes' })
    }

    const ChangeSaveStatus = (): void => {
        if (!loggedInUser) {
            showErrorMsg('Login required')
            return
        }
        if (!storyData?.story) return
        if (isSettingSaveStatus) return
        setIsSettingSaveStatus(true)
        setIsSaved(!isSaved)
        dispatch(changeSaveStatus(!isSaved, loggedInUser._id, { _id: storyData.story._id, imgUrl: storyData.story.imgUrls[0] }, setIsSettingSaveStatus))
    }

    const ChangeLikeStatus = (): void => {
        if (!loggedInUser) {
            showErrorMsg('Login required')
            return
        }
        if (!storyData?.story) return
        if (isSettingLikeStatus) return
        setIsSettingLikeStatus(true)
        setIsLiked(!isLiked)
        dispatch(changeLikeStatus(!isLiked, storyData?.story, setIsSettingLikeStatus))
    }

    const AddUserComment = (comment: string,) => {
        if (storyData?.story)
            dispatch(addUserComment(comment, storyData?.story))
    }

    const toggleSettings = () => {
        if (storyData?.story.by._id !== loggedInUser?._id) return
        setIsOpenSettings(!isOpenSettings)
    }

    const DeletePost = () => {
        dispatch(deleteStory(storyData?.story._id))
    }

    const date = utilService.getDateFormat(storyData?.story.createdAt)

    return (
        <section className={`story-preview ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="header-preview">
                <div onClick={goToProfile} className="user-info">
                    <img src={storyData?.story.by.imgUrl} alt="" />
                    <p>{storyData?.story.by.username}</p>
                    <span>•</span>
                    <span>{date}</span>
                </div>
                <div className="settings-section">
                    <StorySettingsLogo toggleSettings={toggleSettings}></StorySettingsLogo>
                    {isOpenSettings && <SettingsCmp DeletePost={DeletePost}></SettingsCmp>}
                </div>
            </div>
            <ImgCarousel imgUrls={storyData?.story.imgUrls}></ImgCarousel>
            <PostBtnsAction
                isLiked={isLiked}
                ChangeLikeStatus={ChangeLikeStatus}
                isSaved={isSaved}
                ChangeSaveStatus={ChangeSaveStatus}
            />
            {storyData?.story.likedBy.length ? <p onClick={openUserListModal} className="likes" >{storyData?.story.likedBy.length} likes</p> : <p></p>}
            {storyData?.story.txt && <p className="top-comment">
                <span>{storyData?.story.by.username} </span>
                {storyData?.story.txt}
            </p>}
            {storyData?.story.comments.length ? <p onClick={openDetsils} className="toggle-comments">View all {storyData?.story.comments.length} comments</p> : <p></p>}
            <CommentInputBox AddUserComment={AddUserComment}></CommentInputBox>
        </section>
    )
}