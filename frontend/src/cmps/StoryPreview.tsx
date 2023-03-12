import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";
import { eventBus } from "../services/event-bus.service";
import { useSelector } from "react-redux";
import { RootState } from "../interfaces/state";
import { PostBtnsAction } from "./PostBtnsAction";
import { ImgCarousel } from "./ImgCarousel";
import { utilService } from "../services/util.service";

export function StoryPreview({ storyData }: Props) {
    let navigate = useNavigate();
    const isDarkMode = useSelector((state: RootState) => state.storyModule.isDarkMode)

    const openDetsils = (): void => {
        navigate(`/details/${storyData?.story._id}/${storyData?.idx}`)
    }

    const goToProfile = (): void => {
        navigate(`/profile/${storyData?.story.by._id}`)
    }

    const openUserListModal = (): void => {
        eventBus.emit('openUserListModal', { userList: storyData?.story.likedBy, title: 'Likes' })
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
            <PostBtnsAction story={storyData?.story}></PostBtnsAction>
            <p onClick={openUserListModal} className="likes" >{storyData?.story.likedBy.length} likes</p>
            <p className="top-comment">
                {storyData?.story.comments.length && <span>{storyData?.story.comments[0].by.username} </span>}
                {storyData?.story.comments.length && storyData?.story.comments[0].txt}
            </p>
            <p onClick={openDetsils} className="toggle-comments">View all {storyData?.story.comments.length} comments</p>
        </section>
    )
}