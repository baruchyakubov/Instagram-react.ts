export interface User {
    _id: string,
    password: string
    fullname: string,
    imgUrl: string,
    following: {
        _id: string,
        username: string,
        imgUrl: string
    }[],
    followers: {
        _id: string,
        username: string,
        imgUrl: string
    }[],
    recentSearchs: RecentSearchs[],
    isFollowed: boolean,
    username: string,
    createdAt: string
}

export interface RecentSearchs{
    _id: string,
    fullname: string,
    username: string,
    imgUrl: string
}