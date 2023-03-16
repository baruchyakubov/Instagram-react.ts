import { Story } from "../interfaces/story";
import { User } from "../interfaces/user";

export const useCheckIfSaved = (setIsSaved: Function , loggedInUser: User | null , story: Story | null | undefined) => {
    if (!loggedInUser) {
        setIsSaved(false)
        return
    }
    if (!story) return
    const IsSaved = loggedInUser.savedPosts.find(s => {
        return story._id === s._id
    })
    if (IsSaved)
        setIsSaved(true)
    else
        setIsSaved(false)
}