import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Comment, Story } from "../interfaces/story"
import { storyService } from "../services/story.service"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import { CloseBtnLogo } from "../svg-cmps/CloseBtnLogo";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_STATE, RootState } from "../interfaces/state";
import { PostBtnsAction } from "../cmps/PostBtnsAction";
import { LeftArrowLogo } from "../svg-cmps/LeftArrowLogo";
import { RightArrowLogo } from "../svg-cmps/RightArrowLogo";
import { ImgCarousel } from "../cmps/ImgCarousel";
import { showErrorMsg } from "../services/event-bus.service";
import { addUserComment, changeLikeStatus, deleteStory } from "../store/actions/story.actions";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { CommentInputBox } from "../cmps/CommentInputBox";
import { changeSaveStatus } from "../store/actions/user.actions";
import { SettingsCmp } from "../cmps/SettingsCmp";
import { useCheckIfSaved } from "../custom-hooks/useCheckIfSaved";
import { useCheckIfLiked } from "../custom-hooks/useCheckIfLiked";

export function StoryDetails() {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)
    const [isSettingLikeStatus, setIsSettingLikeStatus] = useState<boolean>(false)
    const [isSettingSaveStatus, setIsSettingSaveStatus] = useState<boolean>(false)
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const [story, setStory] = useState<Story | null>(null)
    const params = useParams()
    let navigate = useNavigate();
    const location = useLocation();
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    const loggedInUser = useSelector((state: RootState) => state.userModule.loggedInUser)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)
    const dispatch = useDispatch<ThunkDispatch<INITIAL_STATE, any, AnyAction>>()

    useEffect(() => {
        loadPost()
    }, [params.id, storys])

    useEffect(() => {
        checkIfLiked()
        checkIfSaved()
    }, [story, loggedInUser?._id])

    const checkIfSaved = (): void => useCheckIfSaved(setIsSaved, loggedInUser, story)
    const checkIfLiked = (): void => useCheckIfLiked(setIsLiked, loggedInUser, story)

    const loadPost = async (): Promise<void> => {
        try {
            const StoryId = params.id

            if (StoryId) {
                const Story = await storyService.getById(StoryId)
                if (!Story) throw 'Post does not exict'
                if (Story) setStory(Story)
            }
        } catch {
            showErrorMsg('Post does not exict')
            navigate(`/profile/${params.userId}`)
        }
    }

    const closeDetails = (): void => {
        if (location.pathname === `/details/${params.id}/${params.idx}`)
            navigate('/')
        if (location.pathname === `/explore/details/${params.id}/${params.idx}`)
            navigate('/explore')
        if (location.pathname === `/profile/${params.userId}/details/${params.id}/${params.idx}`)
            navigate(`/profile/${params.userId}`)
    }

    const changeStoryRoute = (diff: number): void => {
        if (params.idx) {
            let idx = JSON.parse(params.idx)
            if (idx === 0 && diff === -1)
                idx = storys.length
            else if (idx === storys.length - 1 && diff === 1)
                idx = -1
            const id = storys[idx + diff]._id
            if (location.pathname === `/explore/details/${params.id}/${params.idx}`)
                navigate(`/explore/details/${id}/${idx + diff}`)
            else if (location.pathname === `/profile/${params.userId}/details/${params.id}/${params.idx}`)
                navigate(`/profile/${params.userId}/details/${id}/${idx + diff}`)
            else
                navigate(`/details/${id}/${idx + diff}`)
        }
    }

    const ChangeSaveStatus = (): void => {
        if (!loggedInUser) {
            showErrorMsg('Login required')
            return
        }
        if (isSettingSaveStatus) return
        setIsSettingSaveStatus(true)
        if (!story) return
        setIsSaved(!isSaved)
        dispatch(changeSaveStatus(!isSaved, loggedInUser._id, { _id: story._id, imgUrl: story.imgUrls[0] }, setIsSettingSaveStatus))
    }

    const ChangeLikeStatus = (): void => {
        if (!loggedInUser) {
            showErrorMsg('Login required')
            return
        }
        if (!story) return
        if (isSettingLikeStatus) return
        setIsSettingLikeStatus(true)
        setIsLiked(!isLiked)
        dispatch(changeLikeStatus(!isLiked, story, setIsSettingLikeStatus))
    }

    const AddUserComment = (comment: string,) => {
        if (story)
            dispatch(addUserComment(comment, story))
    }

    const toggleSettings = () => {
        if (story?.by._id !== loggedInUser?._id) return
        setIsOpenSettings(!isOpenSettings)
    }

    const DeletePost = () => {
        closeDetails()
        dispatch(deleteStory(story?._id))
    }

    if (!story) return <div></div>

    return (
        <>
            <div onClick={closeDetails} className="opacity-wrapper"></div>
            <div onClick={closeDetails} className="close-details">
                <CloseBtnLogo></CloseBtnLogo>
            </div>
            <button onClick={() => changeStoryRoute(1)} className="right">
                <RightArrowLogo></RightArrowLogo>
            </button>
            <button onClick={() => changeStoryRoute(-1)} className="left">
                <LeftArrowLogo></LeftArrowLogo>
            </button>
            <div className={`story-details ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="img-wrapper">
                    <ImgCarousel imgUrls={story?.imgUrls}></ImgCarousel>
                </div>
                <div className="details">
                    <div className="header-details">
                        <div className="user-info">
                            <img src={story?.by.imgUrl} alt="" />
                            <p>{story?.by.username}</p>
                        </div>
                        <div className="settings-section">
                            <StorySettingsLogo toggleSettings={toggleSettings}></StorySettingsLogo>
                            {isOpenSettings && <SettingsCmp DeletePost={DeletePost}></SettingsCmp>}
                        </div>
                    </div>
                    <div className="comments">
                        <div className="comment">
                            <img src={story?.by.imgUrl} alt="" />
                            <p>{story?.by.username} <span>{story?.txt}</span></p>
                        </div>
                        {story?.comments.map((comment: Comment) => {
                            return <div key={comment.id} className="comment">
                                <img src={comment.by.imgUrl} alt="" />
                                <p>{comment.by.username} <span>{comment.txt}</span></p>
                            </div>
                        })}
                    </div>
                    <PostBtnsAction
                        ChangeLikeStatus={ChangeLikeStatus}
                        isLiked={isLiked}
                        isSaved={isSaved}
                        ChangeSaveStatus={ChangeSaveStatus}
                    />
                    <p className="likes">{story?.likedBy.length} likes</p>
                    <CommentInputBox AddUserComment={AddUserComment}></CommentInputBox>
                </div>
            </div>
        </>
    )
}