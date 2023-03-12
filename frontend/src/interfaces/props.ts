import { LikedBy, Story } from "./story";
import { Notification, User } from "./user";

export interface Props {
    storys?: Array<Story>,
    storyData?: Preview,
    isSearchOpened?: boolean,
    setIsSearchOpened?: Function,
    searchItemId?: string
    closeSearchContainer?: Function
    isRecentShown?: boolean
    users?: User[]
    clearInput?: Function
    setIsLogin?: Function
    imgUrl?: string
    setImgUrl?: Function
    Users?: User[]
    likeList?: LikedBy[]
    setIsOpenedLikeList?: Function
    title?: string
    notificationList?: Notification[]
    notification?: Notification
    UpdateFollowStatus?: Function
    checkIfFollowing?: Function
    imgUrls?: string[]
    likeStatus?: boolean
    story?:Story
    checkIfLiked?:Function
    ChangeLikeStatus?: Function
    isLiked?: boolean
    AddUserComment?: Function
}

interface Preview {
    story: Story,
    idx: number
}