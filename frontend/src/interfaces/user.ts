export interface User {
    _id: string
    password: string
    fullname: string
    imgUrl: string
    following: UserInfo[],
    followers: UserInfo[],
    recentSearchs: UserInfo[]
    savedPosts: SavedPosts[]
    notifications: Notification[]
    isFollowed: boolean
    username: string
    createdAt: string
}

export interface SavedPosts {
    _id: string
    imgUrl: string
}

export interface UserInfo {
    _id: string,
    fullname: string
    username: string
    imgUrl: string
}

export interface Notification {
    id: string
    type: string
    by: UserInfo
    txt: string
    storyInfo?: { _id: string, imgUrl: string }
    createdAt: number
}
