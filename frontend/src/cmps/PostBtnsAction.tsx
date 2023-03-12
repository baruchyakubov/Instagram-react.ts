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

export function PostBtnsAction({ story }: Props) {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

    useEffect(() => {
        checkIfLiked()
    }, [storys, loggedInUser?._id])

    const checkIfLiked = (): void => {
        if (!loggedInUser) {
            setIsLiked(false)
            return
        }
        if (!story) return
        const user = story.likedBy.find(user => {
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
        if (!story) return
        setIsLiked(!isLiked)
        dispatch(changeLikeStatus(!isLiked, story))
    }

    return (
        <div className="like-comment-section">
            <div className="col-1">
                <div onClick={ChangeLikeStatus} className="like">
                    <LikeLogo likeStatus={isLiked}></LikeLogo>
                </div>
                <div>
                    <CommentLogo></CommentLogo>
                </div>
                <div>
                    <ShareLogo></ShareLogo>
                </div>
            </div>
            <div>
                <SaveLogo></SaveLogo>
            </div>
        </div>
    )
}