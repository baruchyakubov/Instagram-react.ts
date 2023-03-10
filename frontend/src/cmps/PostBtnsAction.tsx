import { CommentLogo } from "../svg-cmps/CommentLogo";
import { LikeLogo } from "../svg-cmps/LikeLogo";
import { SaveLogo } from "../svg-cmps/SaveLogo";
import { ShareLogo } from "../svg-cmps/ShareLogo";

export function PostBtnsAction() {
    return (
        <div className="like-comment-section">
            <div className="col-1">
                <LikeLogo></LikeLogo>
                <CommentLogo></CommentLogo>
                <ShareLogo></ShareLogo>
            </div>
            <SaveLogo></SaveLogo>
        </div>
    )
}