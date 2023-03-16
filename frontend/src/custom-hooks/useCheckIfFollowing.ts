import { User } from "../interfaces/user"


export const useCheckIfFollowing = (userId: string , loggedInUser: User | null): boolean => {
    const user = loggedInUser?.following.find(user => {
        return user._id === userId
      })
      return user ? true : false
}