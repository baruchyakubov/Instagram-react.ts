import { StorySettingsLogo } from "../svg-cmps/storySettingsLogo";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { LikeLogo } from "../svg-cmps/LikeLogo";
import { CommentLogo } from "../svg-cmps/CommentLogo";
import { ShareLogo } from "../svg-cmps/ShareLogo";
import { SaveLogo } from "../svg-cmps/SaveLogo";
import { useNavigate } from "react-router-dom";
import { Props } from "../interfaces/props";

export function StoryPreview({ storyData }: Props) {
    let navigate = useNavigate();

    const openDetsils = () => {
        navigate(`/details/${storyData?.story._id}/${storyData?.idx}`)
    }

    const goToProfile = () => {
        navigate(`/profile/${storyData?.story.by._id}`)
    }

    const date = storyData?.story.createdAt

    return (
        <section className="story-preview">
            <div className="header-preview">
                <div onClick={goToProfile} className="user-info">
                    <img src={storyData?.story.by.imgUrl} alt="" />
                    <p>{storyData?.story.by.username}</p>
                    <span>•</span>
                    <span>{date}</span>
                </div>
                <StorySettingsLogo></StorySettingsLogo>
            </div>
            <Carousel showStatus={false} showThumbs={false}>
                {storyData?.story.imgUrls.map((img, idx) => {
                    return <img key={idx} className="story-img" src={img} alt="" />
                })}
            </Carousel>
            <div className="like-comment-section">
                <div className="col-1">
                    <LikeLogo></LikeLogo>
                    <CommentLogo></CommentLogo>
                    <ShareLogo></ShareLogo>
                </div>
                <SaveLogo></SaveLogo>
            </div>
            <p className="likes">{storyData?.story.likedBy.length} likes</p>
            <p className="top-comment">
                {storyData?.story.comments.length && <span>{storyData?.story.comments[0].by.username} </span>}
                {storyData?.story.comments.length && storyData?.story.comments[0].txt}
            </p>
            <p onClick={openDetsils} className="toggle-comments">View all {storyData?.story.comments.length} comments</p>
        </section>
    )
}