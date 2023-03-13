import { FilterByUsers } from "../../interfaces/filterBy";
import { Login, Signup } from "../../interfaces/login-signupCred";
import { SavedPosts, User } from "../../interfaces/user";
import { showSuccessMsg } from "../../services/event-bus.service";
import { userService } from "../../services/user.service"

export function getUsers() {
    return async (dispatch: Function, getState: Function) => {
        const users = await userService.getUsers(getState().userModule.filterBy)
        dispatch({ type: 'GET_USERS', users })
    }
}

export function getSearchedUsers() {
    return async (dispatch: Function, getState: Function) => {
        const searchedUsers = await userService.getUsers(getState().userModule.filterBy)
        dispatch({ type: 'GET_SEARCHED_USERS', searchedUsers })
    }
}

export function setFilterBy(filterBy: FilterByUsers) {
    return (dispatch: Function) => {
        dispatch({ type: 'SET_USER_FILTER', filterBy })
        return 'hello'
    }
}

export function login(userCreds: Login) {
    return async (dispatch: Function) => {
        try {
            const loggedInUser = await userService.login(userCreds)
            dispatch({ type: 'UPDATE_USER', user: { ...loggedInUser } })
        } catch (err) {
            console.log(err);
        }
    }
}

export function signup(userCreds: Signup) {
    return async (dispatch: Function) => {
        try {
            await userService.signup(userCreds)
            const users = await userService.getUsers()
            dispatch({ type: 'GET_USERS', users })
            const loggedInUser = await userService.login(userCreds)
            dispatch({ type: 'UPDATE_USER', user: { ...loggedInUser } })
        } catch (err) {
            console.log(err);
        }
    }
}

export function logout() {
    return (dispatch: Function) => {
        userService.logout()
        dispatch({ type: 'LOGOUT' })
    }
}


export function updateUser(user: User) {
    return async (dispatch: Function) => {
        userService.updateUser(user)
        userService.setLoggedInUser(user)
        const users = await userService.getUsers()
        dispatch({ type: 'GET_USERS', users })
        dispatch({ type: 'UPDATE_USER', user })
    }
}

export function setLoggedInUser(user: User) {
    return (dispatch: Function) => {
        dispatch({ type: 'UPDATE_USER', user: userService.setLoggedInUser(user) })
    }
}

export function updateFollowStatus(updatedStatus: string, userId: string) {
    return async (dispatch: Function) => {
        try {
            const user = await userService.updateFollowStatus(updatedStatus, userId)
            dispatch({ type: 'UPDATE_USER', user })
        } catch (err) {
            console.log(err);
        }
    }
}

export function updateOtherUserFollowStatus(user: User) {
    return async (dispatch: Function) => {
        try {
            dispatch({ type: 'UPDATE_USER', user })
        } catch (err) {
            console.log(err);
        }
    }
}

export function changeSaveStatus(updatedStatus: boolean, loggedInUserId: string, story: SavedPosts) {
    return async (dispatch: Function, getState: Function) => {
        try {
            await userService.changeSaveStatus(updatedStatus, loggedInUserId, story)
            const loggedInUser = { ...getState().userModule.loggedInUser }
            updatedStatus ?
                addSavedStory(loggedInUser, story) :
                removeSavedStory(loggedInUser, story)
            userService.setLoggedInUser(loggedInUser)
            dispatch({ type: 'UPDATE_USER', user: loggedInUser })
            return 'hello'
        } catch (err) {
            console.log(err);
        }

    }
}

function addSavedStory(loggedInUser: User, story: SavedPosts): void {
    loggedInUser.savedPosts.unshift(story)
    showSuccessMsg('you saved the post succesfully')
}

function removeSavedStory(loggedInUser: User, story: SavedPosts): void {
    const idx = loggedInUser.savedPosts.findIndex(s => {
        return s._id = story._id
    })
    loggedInUser.savedPosts.splice(idx, 1)
    showSuccessMsg('you removed the post succesfully')
}