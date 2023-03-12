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
import { addUserComment, changeLikeStatus } from "../store/actions/story.actions";
import { CommentInputBox } from "./CommentInputBox";

export function StoryPreview({ storyData }: Props) {
    let navigate = useNavigate();
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    useEffect(() => {
        if (checkIfLiked) checkIfLiked()
    }, [storyData?.story, loggedInUser?._id])

    const openDetsils = (): void => {
        navigate(`/details/${storyData?.story._id}/${storyData?.idx}`)
    }

    const goToProfile = (): void => {
        navigate(`/profile/${storyData?.story.by._id}`)
    }

    const openUserListModal = (): void => {
        eventBus.emit('openUserListModal', { userList: storyData?.story.likedBy, title: 'Likes' })
    }

    const checkIfLiked = (): void => {
        if (!loggedInUser) {
            setIsLiked(false)
            return
        }
        if (!storyData?.story) return
        const user = storyData?.story.likedBy.find(user => {
            return user._id === loggedInUser._id
        })
        if (user) setIsLiked(true)
        else setIsLiked(false)
    }

    const ChangeLikeStatus = (): void => {
        if (!loggedInUser) {
            showErrorMsg('login required')
            return
        }
        if (!storyData?.story) return
        setIsLiked(!isLiked)
        dispatch(changeLikeStatus(!isLiked, storyData?.story))
    }

    const AddUserComment = (comment: string,) => {
        if (storyData?.story)
            dispatch(addUserComment(comment, storyData?.story))
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
                <StorySettingsLogo></StorySettingsLogo>
            </div>
            <ImgCarousel imgUrls={storyData?.story.imgUrls}></ImgCarousel>
            <PostBtnsAction
                isLiked={isLiked}
                ChangeLikeStatus={ChangeLikeStatus}
            />
            <p onClick={openUserListModal} className="likes" >{storyData?.story.likedBy.length} likes</p>
            <p className="top-comment">
                {storyData?.story.comments.length && <span>{storyData?.story.comments[0].by.username} </span>}
                {storyData?.story.comments.length && storyData?.story.comments[0].txt}
            </p>
            <p onClick={openDetsils} className="toggle-comments">View all {storyData?.story.comments.length} comments</p>
            <CommentInputBox AddUserComment={AddUserComment}></CommentInputBox>
        </section>
    )
}