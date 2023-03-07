import { UserInfo } from "./user"

export interface Story {
    _id: string
    imgUrls: Array<string>
    txt: string
    saved: boolean
    by: By
    loc: { lat: number, lng: number, name: string }
    createdAt: string
    comments: Array<Comment>
    likedBy: Array<UserInfo>
    liked: boolean
}

interface By {
    _id: string
    username: string
    imgUrl: string
}

export interface LikedBy {
    _id: string
    fullname: string
    username: string
    imgUrl: string
}

export interface Comment {
    id: string
    by: By
    txt: string
    createdAt: string
}

