import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Comment, Story } from "../interfaces/story"
import { storyService } from "../services/story.service"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import { CloseBtnLogo } from "../svg-cmps/CloseBtnLogo";
import { useSelector } from "react-redux";
import { RootState } from "../interfaces/state";
import { PostBtnsAction } from "../cmps/PostBtnsAction";
import { LeftArrowLogo } from "../svg-cmps/LeftArrowLogo";
import { RightArrowLogo } from "../svg-cmps/RightArrowLogo";
import { ImgCarousel } from "../cmps/ImgCarousel";

export function StoryDetails() {
    const [story, setStory] = useState<Story | null>(null)
    const params = useParams()
    let navigate = useNavigate();
    const location = useLocation();
    const storys = useSelector((state: RootState) => state.storyModule.storys)
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    useEffect(() => {
        loadPost()
    }, [params.id])


    const loadPost = async (): Promise<void> => {
        const StoryId = params.id

        if (StoryId) {
            const Story = await storyService.getById(StoryId)
            if (Story) setStory(Story)
        }
    }

    const closeDetails = (): void => {
        if (location.pathname === `/details/${params.id}/${params.idx}`) navigate('/')
        if (location.pathname === `/explore/details/${params.id}/${params.idx}`) navigate('/explore')
        if (location.pathname === `/profile/${params.userId}/details/${params.id}/${params.idx}`) navigate(`/profile/${params.userId}`)
    }

    const changeStoryRoute = (diff: number): void => {
        if (params.idx) {
            let idx = JSON.parse(params.idx)
            if (idx === 0 && diff === -1) idx = storys.length
            else if (idx === storys.length - 1 && diff === 1) idx = -1
            const id = storys[idx + diff]._id
            if (location.pathname === `/explore/details/${params.id}/${params.idx}`) navigate(`/explore/details/${id}/${idx + diff}`)
            else if (location.pathname === `/profile/${params.userId}/details/${params.id}/${params.idx}`) navigate(`/profile/${params.userId}/details/${id}/${idx + diff}`)
            else navigate(`/details/${id}/${idx + diff}`)
        }
    }

    const date = story?.createdAt

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
                        <StorySettingsLogo></StorySettingsLogo>
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
                    <PostBtnsAction storyId={story._id}></PostBtnsAction>
                    <p className="likes">{story?.likedBy.length} likes</p>
                    <span className="date-details">{date}</span>
                </div>
            </div>
        </>
    )
}