import { FilterByUsers } from "../../interfaces/filterBy";
import { Login, Signup } from "../../interfaces/login-signupCred";
import { SavedPosts, User } from "../../interfaces/user";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { userService } from "../../services/user.service"

export function getUsers() {
    return async (dispatch: Function, getState: Function) => {
        try {
            const users = await userService.getUsers(getState().userModule.filterBy)
            dispatch({ type: 'GET_USERS', users })
        } catch (err) {
            showErrorMsg('Failed to get users')
        }
    }
}

export function getSearchedUsers() {
    return async (dispatch: Function, getState: Function) => {
        try {
            const searchedUsers = await userService.getUsers(getState().userModule.filterBy)
            if (!getState().userModule.filterBy.txt)
                dispatch({ type: 'RESET_SEARCHED_USERS' })
            else
                dispatch({ type: 'GET_SEARCHED_USERS', searchedUsers })
        } catch (err) {
            showErrorMsg('Failed to get users')
        }
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
            showSuccessMsg('You logged in succesfully')
        } catch (err) {
            showErrorMsg('Login failed')
        }
    }
}

export function signup(userCreds: Signup) {
    return async (dispatch: Function) => {
        try {
            await userService.signup(userCreds)
            const loggedInUser = await userService.login(userCreds)
            dispatch({ type: 'UPDATE_USER', user: { ...loggedInUser } })
            showSuccessMsg('You logged in succesfully')
        } catch (err) {
            showErrorMsg('Login failed')
        }
    }
}

export function logout() {
    return async (dispatch: Function) => {
        try {
            await userService.logout()
            dispatch({ type: 'LOGOUT' })
            showSuccessMsg('You logged out succesfully')
        } catch (err) {
            showErrorMsg('Logout failed')
        }

    }
}


export function updateUser(user: User) {
    return async (dispatch: Function) => {
        try {
            await userService.updateUser(user)
            userService.setLoggedInUser(user)
            const users = await userService.getUsers()
            dispatch({ type: 'GET_USERS', users })
            dispatch({ type: 'UPDATE_USER', user })
        } catch (err) {
            showErrorMsg('Update user failed')
        }

    }
}

export function setLoggedInUser(user: User) {
    return (dispatch: Function) => {
        dispatch({ type: 'UPDATE_USER', user: userService.setLoggedInUser(user) })
    }
}

export function updateFollowStatus(updatedStatus: string, userId: string, setIsSettingFollowStatus: Function, username: string) {
    return async (dispatch: Function) => {
        try {
            const user = await userService.updateFollowStatus(updatedStatus, userId)
            dispatch({ type: 'UPDATE_USER', user })
            setIsSettingFollowStatus(false)
            if (updatedStatus === 'Following')
                showSuccessMsg(`You are now following ${username}`)
        } catch (err) {
            showErrorMsg('Follow status update failed')
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

export function changeSaveStatus(updatedStatus: boolean, loggedInUserId: string, story: SavedPosts, setIsSettingSaveStatus: Function) {
    return async (dispatch: Function, getState: Function) => {
        try {
            await userService.changeSaveStatus(updatedStatus, loggedInUserId, story)
            const loggedInUser = { ...getState().userModule.loggedInUser }
            updatedStatus ?
                addSavedStory(loggedInUser, story) :
                removeSavedStory(loggedInUser, story)
            userService.setLoggedInUser(loggedInUser)
            dispatch({ type: 'UPDATE_USER', user: loggedInUser })
            setIsSettingSaveStatus(false)
            return 'hello'
        } catch (err) {
            showErrorMsg('Failed to save the post')
        }

    }
}

function addSavedStory(loggedInUser: User, story: SavedPosts): void {
    loggedInUser.savedPosts.unshift(story)
    showSuccessMsg('You saved the post succesfully')
}

function removeSavedStory(loggedInUser: User, story: SavedPosts): void {
    const idx = loggedInUser.savedPosts.findIndex(s => {
        return s._id = story._id
    })
    loggedInUser.savedPosts.splice(idx, 1)
    showSuccessMsg('You removed the post succesfully')
}