import { Story } from "./story";
import { User } from "./user";

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
}

interface Preview {
    story: Story,
    idx: number
}