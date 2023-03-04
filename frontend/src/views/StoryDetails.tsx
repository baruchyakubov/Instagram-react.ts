import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Comment, Story } from "../interfaces/story"
import { storyService } from "../services/story.service"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import { CloseBtnLogo } from "../svg-cmps/CloseBtnLogo";
import { LikeLogo } from "../svg-cmps/LikeLogo";
import { CommentLogo } from "../svg-cmps/CommentLogo";
import { ShareLogo } from "../svg-cmps/ShareLogo";
import { SaveLogo } from "../svg-cmps/SaveLogo";
import { useSelector } from "react-redux";
import { RootState } from "../interfaces/state";

export function StoryDetails() {
    const [story, setStory] = useState<Story | null>(null)
    const params = useParams()
    let navigate = useNavigate();
    const location = useLocation();
    const storys = useSelector((state: RootState) => state.storyModule.storys)

    useEffect(() => {
        loadPost()
    }, [params.id])


    const loadPost = async () => {
        const StoryId = params.id

        if (StoryId) {
            const Story = await storyService.getById(StoryId)
            if (Story) setStory(Story)
        }
    }

    const closeDetails = () => {
        if (location.pathname === `/details/${params.id}/${params.idx}`) navigate('/')
        if (location.pathname === `/explore/details/${params.id}/${params.idx}`) navigate('/explore')
        if (location.pathname === `/profile/${params.userId}/details/${params.id}/${params.idx}`) navigate(`/profile/${params.userId}`)
    }

    const changeStoryRoute = (diff: number) => {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" /></svg>
            </button>
            <button onClick={() => changeStoryRoute(-1)} className="left">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z" /></svg>
            </button>
            <div className="story-details">
                <div className="img-wrapper">
                    <Carousel showStatus={false} showThumbs={false}>
                        {story?.imgUrls.map((img, idx) => {
                            return <img key={idx} className="story-img" src={img} alt="" />
                        })}
                    </Carousel>
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
                    <div className="like-comment-section">
                        <div className="col-1">
                            <LikeLogo></LikeLogo>
                            <CommentLogo></CommentLogo>
                            <ShareLogo></ShareLogo>
                        </div>
                        <SaveLogo></SaveLogo>
                    </div>
                    <p className="likes">{story?.likedBy.length} likes</p>
                    <span className="date-details">{date}</span>
                </div>
            </div>
        </>
    )
}