import { Story } from "../interfaces/story"
import { User } from "../interfaces/user"

export const useCheckIfLiked = (setIsLiked: Function , loggedInUser:User | null , story:Story | null | undefined) => {
    if (!loggedInUser) {
        setIsLiked(false)
        return
    }
    if (!story) return
    const user = story.likedBy.find(user => {
        return user._id === loggedInUser._id
    })
    if (user) setIsLiked(true)
    else setIsLiked(false)
}