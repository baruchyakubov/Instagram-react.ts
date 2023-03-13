import { Props } from "../interfaces/props";
import { CommentLogo } from "../svg-cmps/CommentLogo";
import { LikeLogo } from "../svg-cmps/LikeLogo";
import { SaveLogo } from "../svg-cmps/SaveLogo";
import { ShareLogo } from "../svg-cmps/ShareLogo";

export function PostBtnsAction({ isLiked, ChangeLikeStatus, isSaved , ChangeSaveStatus }: Props) {
    return (
        <div className="like-comment-section">
            <div className="col-1">
                <div onClick={() => { if (ChangeLikeStatus) ChangeLikeStatus() }} className="like">
                    <LikeLogo likeStatus={isLiked}></LikeLogo>
                </div>
                <div>
                    <CommentLogo></CommentLogo>
                </div>
                <div>
                    <ShareLogo></ShareLogo>
                </div>
            </div>
            <div onClick={() => { if (ChangeSaveStatus) ChangeSaveStatus() }} className={`save ${isSaved ? 'saved' : ''}`}>
                <SaveLogo></SaveLogo>
            </div>
        </div>
    )
}