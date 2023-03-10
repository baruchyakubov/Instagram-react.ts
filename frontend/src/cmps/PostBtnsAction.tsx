import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Props } from "../interfaces/props";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { showErrorMsg } from "../services/event-bus.service";
import { changeLikeStatus } from "../store/actions/story.actions";
import { CommentLogo } from "../svg-cmps/CommentLogo";
import { LikeLogo } from "../svg-cmps/LikeLogo";
import { SaveLogo } from "../svg-cmps/SaveLogo";
import { ShareLogo } from "../svg-cmps/ShareLogo";

export function PostBtnsAction({ storyId }: Props) {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

    useEffect(() => {
        checkIfLiked()
    }, [loggedInUser])

    const checkIfLiked = (): void => {
        if (!loggedInUser) {
            setIsLiked(false)
            return
        }
        if (!storyId) return
        if (loggedInUser.likedPosts.includes(storyId)) setIsLiked(true)
        else setIsLiked(false)
    }

    const ChangeLikeStatus = (): void => {
        setIsLiked(!isLiked)
        if (!loggedInUser) showErrorMsg('login required')
        if (!storyId) return
        dispatch(changeLikeStatus(!isLiked, storyId))
    }

    return (
        <div className="like-comment-section">
            <div className="col-1">
                <div onClick={ChangeLikeStatus} className="liked">
                    <LikeLogo likeStatus={isLiked}></LikeLogo>
                </div>
                <div>
                    <CommentLogo></CommentLogo>
                </div>
                <div>
                    <ShareLogo></ShareLogo>
                </div>
            </div>
            <SaveLogo></SaveLogo>
        </div>
    )
}